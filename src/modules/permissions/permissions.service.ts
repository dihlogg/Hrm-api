import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Permission } from './entities/permission.entity';
import { UserRole } from '../user-role/entities/user-role.entity';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { UserPermission } from './user-permission/entities/user-permission.entity';
import { RolePermission } from './role-permission/entities/role-permission.entity';
import { UserPermissionDto } from './user-permission/dto/create-user-permission.dto';
import { RoleDto } from '../roles/dto/create-role.dto';

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

  async getRolesByPermissionId(permissionId: string): Promise<RoleDto[]> {
    const rolePermissions = await this.rolePermissionRepo.find({
      where: { permissionId },
      relations: ['role'],
    });

    return rolePermissions.map((rp) => {
      const dto = new RoleDto();
      dto.id = rp.role.id;
      dto.name = rp.role.name;
      dto.description = rp.role.description;
      dto.displayOrder = rp.role.displayOrder;
      return dto;
    });
  }

  async getPermissionsByRoleId(roleId: string): Promise<CreatePermissionDto[]> {
    const rolePermissions = await this.rolePermissionRepo.find({
      where: { roleId },
      relations: ['permission'],
    });

    return rolePermissions.map((pr) => {
      const dto = new CreatePermissionDto();
      dto.name = pr.permission.name;
      dto.description = pr.permission.description;
      dto.displayOrder = pr.permission.displayOrder;
      dto.code = pr.permission.code;
      return dto;
    });
  }

  async getUsersByPermissionId(permissionId: string): Promise<UserPermissionDto[]> {
    const userPermissions = await this.userPermissionRepo.find({
      where: { permissionId },
      relations: ['user'],
    });

    return userPermissions.map((up) => {
      const dto = new UserPermissionDto();
      dto.id = up.id;
      dto.userId = up.user.id;
      dto.permissionId = up.permissionId;
      dto.isGranted = up.isGranted;
      return dto;
    });
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
