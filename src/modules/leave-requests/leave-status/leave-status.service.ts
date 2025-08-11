import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateLeaveStatusDto } from './dto/create-leave-status.dto';
import { UpdateLeaveStatusDto } from './dto/update-leave-status.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { LeaveStatus } from './entities/leave-status.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LeaveStatusService {
  constructor(
    @InjectRepository(LeaveStatus)
    private readonly repo: Repository<LeaveStatus>,
  ) {}

  async create(
    createLeaveStatusDto: CreateLeaveStatusDto,
  ): Promise<LeaveStatus> {
    const leaveStatus = this.repo.create(createLeaveStatusDto);
    return await this.repo.save(leaveStatus);
  }

  async findAll(): Promise<LeaveStatus[]> {
    return await this.repo.find({
      order: {
        displayOrder: 'ASC',
      },
    });
  }

  async findOne(id: string): Promise<LeaveStatus> {
    const leaveStatus = await this.repo.findOne({ where: { id } });
    if (!leaveStatus) {
      throw new NotFoundException('Leave Status not found');
    }
    return leaveStatus;
  }

  async update(
    id: string,
    updateLeaveStatusDto: UpdateLeaveStatusDto,
  ): Promise<boolean> {
    const updatedLeaveStatus = await this.repo.update(id, updateLeaveStatusDto);
    if (updatedLeaveStatus.affected === 0) {
      throw new NotFoundException('Leave Status not found');
    }
    return true;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Leave Status not found');
    }
    return true;
  }
}
