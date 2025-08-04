import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserStatus } from './entities/user-status.entity';
import { CreateUserStatusDto } from './dto/create-user-status.dto';
import { UpdateUserStatusDto } from './dto/update-user-status.dto';

@Injectable()
export class UserStatusService {
  constructor(
    @InjectRepository(UserStatus)
    private readonly repo: Repository<UserStatus>,
  ) {}

  async create(createUserStatusDto: CreateUserStatusDto): Promise<UserStatus> {
    const jobTitle = this.repo.create(createUserStatusDto);
    return await this.repo.save(jobTitle);
  }

  async findAll(): Promise<UserStatus[]> {
    return await this.repo.find({
      order: {
        displayOrder: 'ASC',
      }
    });
  }

  async findOne(id: string): Promise<UserStatus> {
    const userStatus = await this.repo.findOne({ where: { id } });
    if (!userStatus) {
      throw new NotFoundException('Status not found');
    }
    return userStatus;
  }

  async update(
    id: string,
    updateUserStatusDto: UpdateUserStatusDto,
  ): Promise<boolean> {
    await this.repo.update(id, updateUserStatusDto);
    const updatedUserStatus = await this.repo.findOne({ where: { id } });
    if (!updatedUserStatus) {
      throw new NotFoundException('Status not found');
    }
    return true;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Status not found');
    }
    return true;
  }

  async sortByName(order: 'ASC' | 'DESC' = 'ASC'): Promise<UserStatus[]> {
    return this.repo.find({
      order: {
        name: order
      }
    })
  }
}
