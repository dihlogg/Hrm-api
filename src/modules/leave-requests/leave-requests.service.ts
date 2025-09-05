import {
  BadRequestException,
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
import { findEntityOrFail } from 'src/common/utils/findEntityOrFail.util';
import { LeaveRequestType } from './leave-request-type/entities/leave-request-type.entity';
import { GetLeaveRequestListDto } from './dto/get-leave-request-list.dto';
import { paginateAndFormat } from 'src/common/utils/pagination/pagination.util';
import { LeaveRequestParticipants } from './leave-request-inform/entities/leave-request-inform.entity';
import { LeaveBalanceDto } from './dto/leave-balance.dto';
import { UpdateLeaveRequestStatusDto } from './dto/update-leave-request-status.dto';

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
  ) {}

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

    const submittedStatusId = '0579fdeb-881d-4fdb-bde1-d75c4984d9b3';

    return await this.repo.manager.transaction(async (manager) => {
      const [employee, leaveStatus, leaveReason, partialDay, leaveRequestType] =
        await Promise.all([
          findEntityOrFail(this.employeeRepo, employeeId, 'Employee'),
          findEntityOrFail(
            this.leaveStatusRepo,
            submittedStatusId,
            'LeaveStatus',
          ),
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

      return await manager.save(leaveRequest);
    });
  }

  async update(
    id: string,
    updateLeaveRequestDto: UpdateLeaveRequestDto,
  ): Promise<boolean> {
    await this.repo.update(id, updateLeaveRequestDto);
    const updateLeaveRequest = await this.repo.findOne({ where: { id } });
    if (!updateLeaveRequest) {
      throw new NotFoundException('Leave Request not found');
    }
    return true;
  }

  async updateLeaveRequestStatus(
    id: string,
    dto: UpdateLeaveRequestStatusDto,
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
    await this.repo.update(id, {
      leaveStatusId: status.id,
      note: note ? note : undefined,
    });

    // 4. Insert participants log flow stt(approve, confirm, inform, reject)
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
          leaveRequest.expectedConfirmId ?? leaveRequest.expectedApproverId, // Nếu reject ở bước PM thì confirmId, nếu reject ở bước Director thì approverId
        type: 'reject',
      });
    }

    return true;
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
}
