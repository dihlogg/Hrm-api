import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateLeaveRequestDto } from './dto/create-leave-request.dto';
import { UpdateLeaveRequestDto } from './dto/update-leave-request.dto';
import { LeaveRequest } from './entities/leave-request.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ObjectLiteral, Repository, SelectQueryBuilder } from 'typeorm';
import { LeaveStatus } from './leave-status/entities/leave-status.entity';
import { LeaveReason } from './leave-reason/entities/leave-reason.entity';
import { PartialDay } from './partial-day/entities/partial-day.entity';
import { Employee } from '../employees/entities/employee.entity';
import { findEntityOrFail } from 'src/common/utils/findEntityOrFail.util';
import { LeaveRequestType } from './leave-request-type/entities/leave-request-type.entity';
import { GetLeaveRequestListDto } from './dto/get-leave-request-list.dto';
import { paginateAndFormat } from 'src/common/utils/pagination/pagination.util';

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
  ) {}

  async findAll(): Promise<LeaveRequest[]> {
    return await this.repo.find();
  }

  async findOne(id: string): Promise<LeaveRequest> {
    const leaveRequest = await this.repo.findOne({ where: { id } });
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
      approverId,
      leaveStatusId,
      leaveReasonId,
      partialDayId,
      leaveRequestTypeId,
    } = createLeaveRequestDto;

    const [
      employee,
      approver,
      leaveStatus,
      leaveReason,
      partialDay,
      leaveRequestType,
    ] = await Promise.all([
      findEntityOrFail(this.employeeRepo, employeeId, 'Employee'),
      findEntityOrFail(this.employeeRepo, approverId, 'Approver'),
      findEntityOrFail(this.leaveStatusRepo, leaveStatusId, 'LeaveStatus'),
      findEntityOrFail(this.leaveReasonRepo, leaveReasonId, 'LeaveReason'),
      findEntityOrFail(this.partialDayRepo, partialDayId, 'PartialDay'),
      findEntityOrFail(this.partialDayRepo, partialDayId, 'PartialDay'),
      findEntityOrFail(
        this.leaveRequestTypeRepo,
        leaveRequestTypeId,
        'leaveRequestType',
      ),
    ]);

    return await this.repo.save(
      this.repo.create({
        ...createLeaveRequestDto,
        employee,
        approver,
        leaveStatus,
        leaveReason,
        partialDay,
        leaveRequestType,
      }),
    );
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
      .leftJoinAndSelect('leaveRequest.leaveRequestType', 'leaveRequestType')
      .leftJoinAndSelect('leaveRequest.leaveStatus', 'leaveStatus');

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
    const { fromDate, toDate, leaveRequestTypeId, leaveStatusId } = dto;

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
