import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateLeaveRequestTypeDto } from './dto/create-leave-request-type.dto';
import { UpdateLeaveRequestTypeDto } from './dto/update-leave-request-type.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { LeaveRequestType } from './entities/leave-request-type.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LeaveRequestTypeService {
  constructor(
    @InjectRepository(LeaveRequestType)
    private readonly repo: Repository<LeaveRequestType>,
  ) {}

  async create(
    createLeaveRequestTypeDto: CreateLeaveRequestTypeDto,
  ): Promise<LeaveRequestType> {
    const requestType = this.repo.create(createLeaveRequestTypeDto);
    return await this.repo.save(requestType);
  }

  async findAll(): Promise<LeaveRequestType[]> {
    return await this.repo.find({
      order: {
        createDate: 'ASC',
      },
    });
  }

  async findOne(id: string): Promise<LeaveRequestType> {
    const requestType = await this.repo.findOne({ where: { id } });
    if (!requestType) {
      throw new NotFoundException('Leave Request Type not found');
    }
    return requestType;
  }

  async update(
    id: string,
    updateLeaveRequestTypeDto: UpdateLeaveRequestTypeDto,
  ): Promise<boolean> {
    const updatedRequestType = await this.repo.update(
      id,
      updateLeaveRequestTypeDto,
    );
    if (updatedRequestType.affected === 0) {
      throw new NotFoundException('Leave Request Type not found');
    }
    return true;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Leave Request Type not found');
    }
    return true;
  }
}
