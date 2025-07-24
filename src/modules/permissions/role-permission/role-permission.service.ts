import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRolePermissionDto } from './dto/create-role-permission.dto';
import { UpdateRolePermissionDto } from './dto/update-role-permission.dto';
import { Repository } from 'typeorm';
import { RolePermission } from './entities/role-permission.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class RolePermissionService {
  constructor(
    @InjectRepository(RolePermission)
    private readonly repo: Repository<RolePermission>,
  ) {}

  async findAll(): Promise<RolePermission[]> {
    return await this.repo.find();
  }

  async findOne(id: string): Promise<RolePermission> {
    const rolePermission = await this.repo.findOne({ where: { id } });
    if (!rolePermission) {
      throw new NotFoundException('This role permission not found');
    }
    return rolePermission;
  }

  async assignPermissionToRole(
    createRolePermission: CreateRolePermissionDto,
  ): Promise<RolePermission> {
    const rolePermission = this.repo.create(createRolePermission);
    return await this.repo.save(rolePermission);
  }

  async update(
    id: string,
    updateRolePermission: UpdateRolePermissionDto,
  ): Promise<boolean> {
    await this.repo.update(id, updateRolePermission);
    const updatedRolePer = await this.repo.findOne({ where: { id } });
    if (!updatedRolePer) {
      throw new NotFoundException('This role permission not found');
    }
    return true;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('This role permission not found');
    }
    return true;
  }
}
