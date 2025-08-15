import { Injectable, NotFoundException } from '@nestjs/common';
import {
  CreateLeaveRequestParticipantsDto,
  CreateLeaveRequestWithManyParticipantsDto,
} from './dto/create-leave-request-participants.dto';
import { UpdateLeaveRequestParticipantsDto } from './dto/update-leave-request-participants.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LeaveRequestParticipants } from './entities/leave-request-inform.entity';

@Injectable()
export class LeaveRequestInformService {
  constructor(
    @InjectRepository(LeaveRequestParticipants)
    private readonly repo: Repository<LeaveRequestParticipants>,
  ) {}

  async create(
    requestParticipantDto: CreateLeaveRequestParticipantsDto,
  ): Promise<LeaveRequestParticipants> {
    const createRequestDto = this.repo.create(requestParticipantDto);
    return await this.repo.save(createRequestDto);
  }

  async createMultiple(
    dto: CreateLeaveRequestWithManyParticipantsDto,
  ): Promise<boolean> {
    await this.repo.manager.transaction(async (manager) => {
      await manager.insert(LeaveRequestParticipants, {
        leaveRequestId: dto.leaveRequestId,
        employeeId: dto.approverId,
        type: 'approve',
      });
      await manager.insert(LeaveRequestParticipants, {
        leaveRequestId: dto.leaveRequestId,
        employeeId: dto.informToId,
        type: 'inform',
      });
    });
    return true;
  }

  async findAll(): Promise<LeaveRequestParticipants[]> {
    return await this.repo.find({
      order: {
        createDate: 'ASC',
      },
    });
  }

  async findOne(id: string): Promise<LeaveRequestParticipants> {
    const requestParticipant = await this.repo.findOne({ where: { id } });
    if (!requestParticipant) {
      throw new NotFoundException(
        'No employees found associated with this leave request',
      );
    }
    return requestParticipant;
  }

  async update(
    id: string,
    updateRequestDto: UpdateLeaveRequestParticipantsDto,
  ): Promise<boolean> {
    const updateRequet = await this.repo.update(id, updateRequestDto);
    if (updateRequet.affected === 0) {
      throw new NotFoundException(
        'No employees found associated with this leave request',
      );
    }
    return true;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(
        'No employees found associated with this leave request',
      );
    }
    return true;
  }
}
