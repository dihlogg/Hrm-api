// src/modules/permissions/permissions.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Permission } from './entities/permission.entity';
import { UserRole } from '../user-role/entities/user-role.entity';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { UserPermission } from './user-permission/entities/user-permission.entity';
import { RolePermission } from './role-permission/entities/role-permission.entity';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepo: Repository<Permission>,
    @InjectRepository(UserPermission)
    private readonly userPermissionRepo: Repository<UserPermission>,
    @InjectRepository(UserRole)
    private readonly userRoleRepo: Repository<UserRole>,
    @InjectRepository(RolePermission)
    private readonly rolePermissionRepo: Repository<RolePermission>,
  ) {}

  // CRUD Permission
  async create(createPermissionDto: CreatePermissionDto): Promise<Permission> {
    const permission = this.permissionRepo.create(createPermissionDto);
    return await this.permissionRepo.save(permission);
  }

  async findAll(): Promise<Permission[]> {
    return await this.permissionRepo.find();
  }

  async findOne(id: string): Promise<Permission> {
    const permission = await this.permissionRepo.findOne({ where: { id } });
    if (!permission) {
      throw new NotFoundException('Permission not found');
    }
    return permission;
  }

  async update(
    id: string,
    updatePermissionDto: UpdatePermissionDto,
  ): Promise<boolean> {
    await this.permissionRepo.update(id, updatePermissionDto);
    const updated = await this.permissionRepo.findOne({ where: { id } });
    if (!updated) {
      throw new NotFoundException('Permission not found');
    }
    return true;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.permissionRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Permission not found');
    }
    return true;
  }

  //Lấy danh sách role có quyền
  async getRolesByPermissionId(
    id: string,
  ): Promise<
    { id: string; name: string; description: string; display_order: number }[]
  > {
    const rolePermissions = await this.rolePermissionRepo.find({
      where: { permissionId: id },
      relations: ['role'],
    });

    return rolePermissions.map((rp) => ({
      id: rp.role.id,
      name: rp.role.name,
      description: rp.role.description,
      display_order: rp.role.displayOrder,
    }));
  }

  // Lấy danh sách user được cấp quyền trực tiếp
  async getUsersByPermissionId(
    permissionId: string,
  ): Promise<
    {
      id: string;
      user_name: string;
      user_status_id: string;
      is_granted: boolean;
    }[]
  > {
    const userPerms = await this.userPermissionRepo.find({
      where: { permissionId },
      relations: ['user'],
    });

    return userPerms.map((up) => ({
      id: up.user.id,
      user_name: up.user.userName,
      user_status_id: up.user.userStatusId,
      is_granted: up.isGranted,
    }));
  }

  // Dynamic Authorization
  async getPermissionsByUserId(userId: string): Promise<string[]> {
    // 1. User permissions
    const userPermissions = await this.userPermissionRepo.find({
      where: { userId: userId },
      relations: ['permission'],
    });

    const granted = userPermissions
      .filter((up) => up.isGranted)
      .map((up) => up.permission?.code);

    const revoked = userPermissions
      .filter((up) => up.isGranted === false)
      .map((up) => up.permission?.code);

    const userRoles = await this.userRoleRepo.find({
      where: { userId: userId },
    });
    const roleIds = userRoles.map((ur) => ur.roleId);
    if (roleIds.length === 0) {
      return granted;
    }
    const rolePermissions = await this.rolePermissionRepo.find({
      where: { roleId: In(roleIds) },
      relations: ['permission'],
    });
    const roleCodes = rolePermissions.map((rp) => rp.permission?.code);

    const allPermissions = new Set([...roleCodes, ...granted]);
    revoked.forEach((code) => allPermissions.delete(code));

    return Array.from(allPermissions);
  }
}
