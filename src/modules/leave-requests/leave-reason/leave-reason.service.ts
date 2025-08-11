import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateLeaveReasonDto } from './dto/create-leave-reason.dto';
import { UpdateLeaveReasonDto } from './dto/update-leave-reason.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { LeaveReason } from './entities/leave-reason.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LeaveReasonService {
  constructor(
    @InjectRepository(LeaveReason)
    private readonly repo: Repository<LeaveReason>,
  ) {}

  async create(
    createLeaveReasonDto: CreateLeaveReasonDto,
  ): Promise<LeaveReason> {
    const leaveReason = this.repo.create(createLeaveReasonDto);
    return await this.repo.save(leaveReason);
  }

  async findAll(): Promise<LeaveReason[]> {
    return await this.repo.find({
      order: {
        displayOrder: 'ASC',
      },
    });
  }

  async findOne(id: string): Promise<LeaveReason> {
    const leaveReason = await this.repo.findOne({ where: { id } });
    if (!leaveReason) {
      throw new NotFoundException('Leave Reason not found');
    }
    return leaveReason;
  }

  async update(
    id: string,
    updateLeaveReasonDto: UpdateLeaveReasonDto,
  ): Promise<boolean> {
    const updatedLeaveReason = await this.repo.update(id, updateLeaveReasonDto);
    if (updatedLeaveReason.affected === 0) {
      throw new NotFoundException('Leave Reason not found');
    }
    return true;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Leave Reason not found');
    }
    return true;
  }
}
