import { Injectable, NotFoundException } from '@nestjs/common';
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
        'participantsRequests.employees'
      ]
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
      approverId,
      informToId,
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
      });
      const savedLeaveRequest = await manager.save(leaveRequest);

      const approverParticipant = manager.create(LeaveRequestParticipants, {
        leaveRequestId: savedLeaveRequest.id,
        employeeId: approverId,
        type: 'approve',
      });

      const informParticipant = manager.create(LeaveRequestParticipants, {
        leaveRequestId: savedLeaveRequest.id,
        employeeId: informToId,
        type: 'inform',
      });

      await manager.save([approverParticipant, informParticipant]);

      return savedLeaveRequest;
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

  async delete(id: string): Promise<boolean> {
    const result = await this.repo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Leave Request not found');
    }
    return true;
  }

  async getLeaveRequestList(dto: GetLeaveRequestListDto) {
    const { page = 1, pageSize = 10 } = dto;

    let query = this.repo
      .createQueryBuilder('leaveRequest')
      .leftJoinAndSelect('leaveRequest.employee', 'employee')
      .leftJoinAndSelect('leaveRequest.leaveStatus', 'leaveStatus')
      .leftJoinAndSelect('leaveRequest.leaveReason', 'leaveReason')
      .leftJoinAndSelect('leaveRequest.partialDay', 'partialDay')
      .leftJoinAndSelect('leaveRequest.leaveRequestType', 'leaveRequestType')
      .leftJoinAndSelect('leaveRequest.participantsRequests', 'participantsRequests')
      .leftJoinAndSelect('participantsRequests.employees', 'participantEmployees')

    query = this.applyFilters(query, dto);
    query = this.applySorting(query, dto);

    return paginateAndFormat(query, {
      page: Number(page),
      pageSize: Number(pageSize),
      useQueryBuilder: true,
      queryBuilder: query,
    });
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