import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserPermissionDto } from './dto/create-user-permission.dto';
import { UpdateUserPermissionDto } from './dto/update-user-permission.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserPermission } from './entities/user-permission.entity';
import { Repository } from 'typeorm';
import { RolePermission } from '../role-permission/entities/role-permission.entity';

@Injectable()
export class UserPermissionService {
  constructor(
    @InjectRepository(UserPermission)
    private readonly repo: Repository<UserPermission>,
  ) {}

  async findAll(): Promise<UserPermission[]> {
    return await this.repo.find();
  }

  async findOne(id: string): Promise<UserPermission> {
    const userPermission = await this.repo.findOne({ where: { id } });
    if (!userPermission) {
      throw new NotFoundException('This user permission not found');
    }
    return userPermission;
  }

  async assignPermissionToUser(
    createUserPermission: CreateUserPermissionDto,
  ): Promise<UserPermission> {
    const userPermission = this.repo.create(createUserPermission);
    return await this.repo.save(userPermission);
  }

  async changeStatusGranted(
    id: string,
    updateUserPermission: UpdateUserPermissionDto,
  ): Promise<boolean> {
    await this.repo.update(id, updateUserPermission);
    const updatedUserPer = await this.repo.findOne({ where: { id } });
    if (!updatedUserPer) {
      throw new NotFoundException('This user permission not found');
    }
    return true;
  }

  async deletePermissionFromUser(id: string): Promise<boolean> {
    const result = await this.repo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('This user permission not found');
    }
    return true;
  }
}
