import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateLeaveRequestDto } from './dto/create-leave-request.dto';
import { UpdateLeaveRequestDto } from './dto/update-leave-request.dto';
import { LeaveRequest } from './entities/leave-request.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { LeaveStatus } from './leave-status/entities/leave-status.entity';
import { LeaveReason } from './leave-reason/entities/leave-reason.entity';
import { PartialDay } from './partial-day/entities/partial-day.entity';
import { Employee } from '../employees/entities/employee.entity';
import { findEntityOrFail } from '../../common/utils/findEntityOrFail.util';
import { LeaveRequestType } from './leave-request-type/entities/leave-request-type.entity';
import { GetLeaveRequestListDto } from './dto/get-leave-request-list.dto';
import { paginateAndFormat } from '../../common/utils/pagination/pagination.util';
import { LeaveRequestParticipants } from './leave-request-inform/entities/leave-request-inform.entity';
import { LeaveBalanceDto } from './dto/leave-balance.dto';
import { UpdateLeaveRequestStatusDto } from './dto/update-leave-request-status.dto';
import { ProducerService } from '../../kafka/producers/producer.service';
import { KAFKA_TOPICS } from '../../kafka/config/kafka-topics.constant';

@Injectable()
export class LeaveRequestsService {
  constructor(
    @InjectRepository(LeaveRequest)
    private readonly repo: Repository<LeaveRequest>,
    @InjectRepository(LeaveStatus)
    private readonly leaveStatusRepo: Repository<LeaveStatus>,
    @InjectRepository(LeaveReason)
    private readonly leaveReasonRepo: Repository<LeaveReason>,
    @InjectRepository(PartialDay)
    private readonly partialDayRepo: Repository<PartialDay>,
    @InjectRepository(LeaveRequestType)
    private readonly leaveRequestTypeRepo: Repository<LeaveRequestType>,
    @InjectRepository(Employee)
    private readonly employeeRepo: Repository<Employee>,
    @InjectRepository(LeaveRequestParticipants)
    private readonly participantsRepo: Repository<LeaveRequestParticipants>,
    private readonly kafkaProducer: ProducerService
  ) { }

  async findAll(): Promise<LeaveRequest[]> {
    return await this.repo.find();
  }

  async findOne(id: string): Promise<LeaveRequest> {
    const leaveRequest = await this.repo.findOne({
      where: { id },
      relations: [
        'employee',
        'leaveStatus',
        'leaveReason',
        'partialDay',
        'leaveRequestType',
        'participantsRequests',
        'participantsRequests.employees',
      ],
    });

    if (!leaveRequest) {
      throw new NotFoundException('Leave Request not found');
    }
    return leaveRequest;
  }

  async create(
    createLeaveRequestDto: CreateLeaveRequestDto,
  ): Promise<LeaveRequest> {
    const {
      employeeId,
      leaveReasonId,
      partialDayId,
      leaveRequestTypeId,
      expectedApproverId,
      expectedInformToId,
      expectedConfirmId,
    } = createLeaveRequestDto;

    const leaveStatus = await this.leaveStatusRepo.findOne({
      where: { statusCode: 'SUBMITTED' } // Hoặc 'PENDING' tùy theo DB của bạn
    });

    if (!leaveStatus) {
      throw new Error('Leave status with system code SUBMITTED not found');
    }

    return await this.repo.manager.transaction(async (manager) => {
      const [employee, leaveReason, partialDay, leaveRequestType] =
        await Promise.all([
          findEntityOrFail(this.employeeRepo, employeeId, 'Employee'),
          findEntityOrFail(this.leaveReasonRepo, leaveReasonId, 'LeaveReason'),
          findEntityOrFail(this.partialDayRepo, partialDayId, 'PartialDay'),
          findEntityOrFail(
            this.leaveRequestTypeRepo,
            leaveRequestTypeId,
            'LeaveRequestType',
          ),
        ]);

      const leaveRequest = manager.create(LeaveRequest, {
        ...createLeaveRequestDto,
        employee,
        leaveStatus,
        leaveReason,
        partialDay,
        leaveRequestType,
        expectedApproverId,
        expectedInformToId,
        expectedConfirmId,
      });
      // push event kafka
      const savedLeaveRequest = await manager.save(leaveRequest);

      await this.kafkaProducer.produce(KAFKA_TOPICS.LEAVE_REQUEST_CREATED, {
        key: savedLeaveRequest.id,
        value: JSON.stringify({
          leaveRequest: savedLeaveRequest,
          actor: {
            id: employee.id,
            firstName: employee.firstName,
            lastName: employee.lastName,
          },
        }),
      });

      return savedLeaveRequest;
    });
  }

  async update(
    id: string,
    updateLeaveRequestDto: UpdateLeaveRequestDto,
  ): Promise<boolean> {
    return await this.repo.manager.transaction(async (manager) => {
      // check leave request
      const existingLeaveRequest = await manager.findOne(LeaveRequest, {
        where: { id },
        relations: ['employee', 'leaveStatus'],
      });

      if (!existingLeaveRequest) {
        throw new NotFoundException('Leave Request not found');
      }

      await manager.update(LeaveRequest, id, updateLeaveRequestDto);

      const updatedLeaveRequest = await manager.findOne(LeaveRequest, {
        where: { id },
        relations: ['employee', 'leaveStatus'],
      });

      if (!updatedLeaveRequest) {
        throw new NotFoundException('Updated Leave Request not found');
      }

      // push sang rabbitMQ
      await this.kafkaProducer.produce(KAFKA_TOPICS.LEAVE_REQUEST_UPDATED, {
        key: updatedLeaveRequest.id,
        value: JSON.stringify({
          leaveRequest: updatedLeaveRequest,
          actor: {
            id: updatedLeaveRequest.employee.id,
            firstName: updatedLeaveRequest.employee.firstName,
            lastName: updatedLeaveRequest.employee.lastName,
          },
        })
      });

      return true;
    });
  }

  async updateLeaveRequestStatus(
    id: string,
    dto: UpdateLeaveRequestStatusDto,
    userId: string,
  ): Promise<boolean> {
    const { statusCode, note } = dto;
    const status = await this.leaveStatusRepo.findOne({
      where: { statusCode },
    });
    if (!status) {
      throw new NotFoundException(
        `Leave status with code "${statusCode}" not found in database`,
      );
    }
    const leaveRequest = await this.repo.findOne({
      where: { id },
      relations: ['employee'],
    });
    if (!leaveRequest) {
      throw new NotFoundException('Leave request not found');
    }

    if (leaveRequest.leaveStatusId === status.id) {
      throw new BadRequestException(
        `This leave request is already in status "${statusCode}"`,
      );
    }

    if (statusCode === 'PENDING' && (!note || note.trim() === '')) {
      throw new BadRequestException(
        'Note is required when setting status to PENDING',
      );
    }
    // get employee actor
    const actorEmployee = await this.employeeRepo.findOne({
      where: { userId },
    });
    if (!actorEmployee) {
      throw new NotFoundException('Employee not found for this user');
    }
    const actorEmployeeId = await this.getActorEmployeeId(
      statusCode,
      actorEmployee,
      leaveRequest,
      userId,
    );

    const actor = await findEntityOrFail(
      this.employeeRepo,
      actorEmployeeId,
      'Actor Employee',
    );
    // get previous status
    const previousStatusEntity = await this.leaveStatusRepo.findOne({
      where: { id: leaveRequest.leaveStatusId },
    });
    await this.repo.update(id, {
      leaveStatusId: status.id,
      note: note ? note : undefined,
    });

    // insert participants log flow stt(approve, confirm, inform, reject)
    if (statusCode === 'CONFIRMED') {
      await this.participantsRepo.save({
        leaveRequestId: leaveRequest.id,
        employeeId: leaveRequest.expectedConfirmId, // PM confirm (expected)
        type: 'confirm',
      });
    }

    if (statusCode === 'PENDING') {
      await this.participantsRepo.save({
        leaveRequestId: leaveRequest.id,
        employeeId: leaveRequest.expectedConfirmId, // PM pending (expected)
        type: 'pending',
      });
    }

    if (statusCode === 'APPROVED') {
      await this.participantsRepo.save({
        leaveRequestId: leaveRequest.id,
        employeeId: leaveRequest.expectedApproverId, // Director approve (expected)
        type: 'approve',
      });

      if (leaveRequest.expectedInformToId) {
        await this.participantsRepo.save({
          leaveRequestId: leaveRequest.id,
          employeeId: leaveRequest.expectedInformToId, // notify user (expected)
          type: 'inform',
        });
      }
    }

    if (statusCode === 'REJECTED') {
      await this.participantsRepo.save({
        leaveRequestId: leaveRequest.id,
        employeeId:
          leaveRequest.expectedConfirmId ?? leaveRequest.expectedApproverId, // Nếu reject ở Manager thì confirmId, nếu reject ở Director thì approverId
        type: 'reject',
      });
    }

    const updatedLeaveRequest = await this.repo.findOne({
      where: { id },
      relations: ['employee', 'leaveStatus'],
    });

    if (!updatedLeaveRequest) {
      throw new NotFoundException('Updated Leave Request not found');
    }

    await this.kafkaProducer.produce(KAFKA_TOPICS.LEAVE_REQUEST_STATUS_UPDATED, {
      key: updatedLeaveRequest.id,
      value: JSON.stringify({
        leaveRequest: updatedLeaveRequest,
        actor: {
          id: actor.id,
          firstName: actor.firstName,
          lastName: actor.lastName,
        },
        previousStatus: previousStatusEntity?.name,
        newStatus: status.name,
      })
    });

    return true;
  }

  private async getActorEmployeeId(
    statusCode: string,
    actorEmployee: Employee,
    leaveRequest: LeaveRequest,
    userId: string,
  ): Promise<string> {
    const userRoles = await this.repo.manager.query(`
      SELECT r.name 
      FROM "UserRole" ur 
      JOIN "Roles" r ON ur."roleId" = r.id 
      WHERE ur."userId" = $1
    `, [userId]);
    const roleNames = userRoles.map((r: any) => r.name);
    const isSuperAdmin = roleNames.includes('Super Admin');
    const isAdmin = roleNames.includes('Admin');

    if (['CONFIRMED', 'PENDING'].includes(statusCode)) {
      if (!isAdmin && !isSuperAdmin) {
        throw new ForbiddenException('Only Admin can confirm leave requests');
      }
      if (actorEmployee.id !== leaveRequest.expectedConfirmId && !isSuperAdmin) {
        throw new ForbiddenException(
          'Only the expected confirmer can perform this action',
        );
      }
      return isSuperAdmin ? actorEmployee.id : leaveRequest.expectedConfirmId;
    }

    if (statusCode === 'APPROVED') {
      if (!isSuperAdmin) {
        throw new ForbiddenException('Only Super Admin can approve leave requests');
      }
      return actorEmployee.id;
    }

    if (statusCode === 'REJECTED') {
      const currentStatus = await this.leaveStatusRepo.findOne({
        where: { id: leaveRequest.leaveStatusId },
      });

      if (currentStatus?.statusCode === 'SUBMITTED') {
        if (actorEmployee.id !== leaveRequest.expectedConfirmId && !isSuperAdmin) {
          throw new ForbiddenException(
            'Only the manager can reject at this stage',
          );
        }
        return isSuperAdmin ? actorEmployee.id : leaveRequest.expectedConfirmId;
      }

      if (currentStatus?.statusCode === 'PENDING') {
        if (actorEmployee.id !== leaveRequest.expectedConfirmId && !isSuperAdmin) {
          throw new ForbiddenException(
            'Only the manager can reject at this stage (PENDING)',
          );
        }
        return isSuperAdmin ? actorEmployee.id : leaveRequest.expectedConfirmId;
      }

      if (currentStatus?.statusCode === 'CONFIRMED') {
        if (actorEmployee.id !== leaveRequest.expectedApproverId && !isSuperAdmin) {
          throw new ForbiddenException(
            'Only the director can reject at this stage',
          );
        }
        return isSuperAdmin ? actorEmployee.id : leaveRequest.expectedApproverId;
      }

      throw new BadRequestException('Cannot reject from current status');
    }

    return actorEmployee.id; // fallback
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Leave Request not found');
    }
    return true;
  }

  async getLeaveBalancesByEmployee(
    employeeId: string,
  ): Promise<LeaveBalanceDto[]> {
    const leaveTypes = await this.leaveRequestTypeRepo.find();

    const leaveRequests = await this.repo.find({
      where: { employeeId },
      relations: ['leaveStatus', 'leaveRequestType'],
    });

    return leaveTypes.map((type) => {
      const requestsOfType = leaveRequests.filter(
        (req) => req.leaveRequestTypeId === type.id,
      );

      // Approved
      const approvedQuotas = requestsOfType
        .filter((req) => req.leaveStatus?.name === 'Approved')
        .reduce((sum, req) => sum + Number(req.duration || 0), 0);

      // Pending
      const pendingQuotas = requestsOfType
        .filter((req) => req.leaveStatus?.name === 'Pending')
        .reduce((sum, req) => sum + Number(req.duration || 0), 0);

      // Remaining
      const remainingQuotas = type.maximumAllowed - approvedQuotas;

      return {
        leaveRequestTypeId: type.id,
        leaveRequestTypeName: type.name,
        maximumAllowed: type.maximumAllowed,
        approvedQuotas,
        pendingQuotas,
        remainingQuotas,
      };
    });
  }

  async getLeaveRequestList(dto: GetLeaveRequestListDto) {
    const { page = 1, pageSize = 10 } = dto;

    let query = this.buildBaseQuery();

    query = this.applyFilters(query, dto);
    query = this.applySorting(query, dto);

    return paginateAndFormat(query, {
      page: Number(page),
      pageSize: Number(pageSize),
      useQueryBuilder: true,
      queryBuilder: query,
    });
  }

  async getLeaveRequestListByEmployeeId(
    employeeId: string,
    dto: GetLeaveRequestListDto,
  ) {
    const { page = 1, pageSize = 10 } = dto;

    let query = this.buildBaseQuery().where(
      'leaveRequest.employeeId = :employeeId',
      { employeeId },
    );

    query = this.applyFilters(query, dto);
    query = this.applySorting(query, dto);

    return paginateAndFormat(query, {
      page: Number(page),
      pageSize: Number(pageSize),
      useQueryBuilder: true,
      queryBuilder: query,
    });
  }

  async getLeaveRequestsForSupervisor(
    supervisorId: string,
    dto: GetLeaveRequestListDto,
  ) {
    const { page = 1, pageSize = 10 } = dto;

    let query = this.buildBaseQuery().where(
      'employee.parentId = :supervisorId',
      { supervisorId },
    );

    query = this.applyFilters(query, dto);
    query = this.applySorting(query, dto);

    return paginateAndFormat(query, {
      page: Number(page),
      pageSize: Number(pageSize),
      useQueryBuilder: true,
      queryBuilder: query,
    });
  }

  async getLeaveRequestsForDirector(
    directorId: string,
    dto: GetLeaveRequestListDto,
  ) {
    const { page = 1, pageSize = 10 } = dto;

    let query = this.buildBaseQuery()
      .leftJoinAndSelect('employee.supervisor', 'manager')
      .leftJoinAndSelect('manager.supervisor', 'director')
      .where(
        '(director.id = :directorId OR employee.supervisor = :directorId)',
        { directorId },
      );

    query = this.applyFilters(query, dto);
    query = this.applySorting(query, dto);

    return paginateAndFormat(query, {
      page: Number(page),
      pageSize: Number(pageSize),
      useQueryBuilder: true,
      queryBuilder: query,
    });
  }

  async getMyPendingRequests(
    employeeId: string,
    dto: GetLeaveRequestListDto,
  ) {
    const { page = 1, pageSize = 10 } = dto;

    let query = this.buildBaseQuery()
      .where('leaveRequest.employeeId = :employeeId', { employeeId })
      .andWhere('leaveStatus.statusCode = :statusCode', {
        statusCode: 'PENDING',
      });

    query = this.applyFilters(query, dto);
    query = this.applySorting(query, dto);

    return paginateAndFormat(query, {
      page: Number(page),
      pageSize: Number(pageSize),
      useQueryBuilder: true,
      queryBuilder: query,
    });
  }

  async getReceiveRequests(
    employeeId: string,
    dto: GetLeaveRequestListDto,
  ) {
    const { page = 1, pageSize = 10 } = dto;

    let query = this.buildBaseQuery().where(
      '(leaveRequest.expectedApproverId = :employeeId OR leaveRequest.expectedConfirmId = :employeeId OR leaveRequest.expectedInformToId = :employeeId)',
      { employeeId },
    );

    query = this.applyFilters(query, dto);
    query = this.applySorting(query, dto);

    return paginateAndFormat(query, {
      page: Number(page),
      pageSize: Number(pageSize),
      useQueryBuilder: true,
      queryBuilder: query,
    });
  }

  private buildBaseQuery() {
    return this.repo
      .createQueryBuilder('leaveRequest')
      .leftJoinAndSelect('leaveRequest.employee', 'employee')
      .leftJoinAndSelect('leaveRequest.leaveStatus', 'leaveStatus')
      .leftJoinAndSelect('leaveRequest.leaveReason', 'leaveReason')
      .leftJoinAndSelect('leaveRequest.partialDay', 'partialDay')
      .leftJoinAndSelect('leaveRequest.leaveRequestType', 'leaveRequestType')
      .leftJoinAndSelect(
        'leaveRequest.participantsRequests',
        'participantsRequests',
      )
      .leftJoinAndSelect(
        'participantsRequests.employees',
        'participantEmployees',
      );
  }

  private applyFilters(
    query: SelectQueryBuilder<LeaveRequest>,
    dto: GetLeaveRequestListDto,
  ) {
    const { fromDate, toDate, leaveRequestTypeId, leaveStatusId, employeeId } =
      dto;

    if (fromDate && toDate) {
      query
        .andWhere('leaveRequest.fromDate <= :toDate', { toDate })
        .andWhere('leaveRequest.toDate >= :fromDate', { fromDate });
    } else if (fromDate) {
      query.andWhere('leaveRequest.toDate >= :fromDate', { fromDate });
    } else if (toDate) {
      query.andWhere('leaveRequest.fromDate <= :toDate', { toDate });
    }

    if (leaveRequestTypeId) {
      query.andWhere('leaveRequest.leaveRequestTypeId = :leaveRequestTypeId', {
        leaveRequestTypeId,
      });
    }

    if (leaveStatusId) {
      query.andWhere('leaveRequest.leaveStatusId = :leaveStatusId', {
        leaveStatusId,
      });
    }
    if (employeeId) {
      query.andWhere('leaveRequest.employeeId = :employeeId', {
        employeeId,
      });
    }

    return query;
  }

  private applySorting(
    query: SelectQueryBuilder<LeaveRequest>,
    dto: GetLeaveRequestListDto,
  ) {
    const sortFieldMap = {
      leaveRequestType: 'leaveRequestType.name',
      leaveStatus: 'leaveStatus.name',
    };

    if (!dto.sortBy || !dto.sortOrder) {
      return query.orderBy('leaveRequest.createDate', 'DESC');
    }

    const sortField = sortFieldMap[dto.sortBy];
    const sortOrder = dto.sortOrder;

    return query.orderBy(sortField, sortOrder);
  }

  async getLeaveRequestStats(employeeId?: string, supervisorId?: string) {
    let query = this.repo
      .createQueryBuilder('leaveRequest')
      .leftJoin('leaveRequest.leaveStatus', 'leaveStatus')
      .leftJoin('leaveRequest.employee', 'employee')
      .select('leaveStatus.statusCode', 'status')
      .addSelect('COUNT(leaveRequest.id)', 'count');

    if (employeeId) {
      query = query.where('leaveRequest.employeeId = :employeeId', { employeeId });
    } else if (supervisorId) {
      query = query.where('employee.parentId = :supervisorId', { supervisorId });
    }

    return await query.groupBy('leaveStatus.statusCode').getRawMany();
  }

  async getCompanyLeaveFundStats() {
    const totalEmployees = await this.employeeRepo.count();
    const leaveTypes = await this.leaveRequestTypeRepo.find();

    const totalAllowedQuotas = leaveTypes.reduce((sum, type) => sum + Number(type.maximumAllowed || 0), 0) * totalEmployees;

    const result = await this.repo
      .createQueryBuilder('leaveRequest')
      .leftJoin('leaveRequest.leaveStatus', 'leaveStatus')
      .where('leaveStatus.name = :statusName', { statusName: 'Approved' })
      .select('SUM(leaveRequest.duration)', 'totalUsed')
      .getRawOne();

    const totalUsedQuotas = Number(result?.totalUsed || 0);

    return {
      totalAllowedQuotas,
      totalUsedQuotas,
      remainingQuotas: totalAllowedQuotas - totalUsedQuotas,
      totalEmployees,
    };
  }
}
