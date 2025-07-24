import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { RolePermissionService } from './role-permission.service';
import { CreateRolePermissionDto } from './dto/create-role-permission.dto';
import { UpdateRolePermissionDto } from './dto/update-role-permission.dto';
import { ApiTags } from '@nestjs/swagger';
import { RolePermission } from './entities/role-permission.entity';

@ApiTags('Role-permission')
@Controller('Role-permission')
export class RolePermissionController {
  constructor(private readonly rolePermissionService: RolePermissionService) {}

  //get all role permissions
  @Get('GetAllRolePermissions')
  async findAll(): Promise<RolePermission[]> {
    return await this.rolePermissionService.findAll();
  }

  //assign permissions to roles
  @Post('AssignPermissionToRole')
  async assignPermissionToRole(
    @Body() createRolePermission: CreateRolePermissionDto,
  ): Promise<RolePermission> {
    return await this.rolePermissionService.assignPermissionToRole(
      createRolePermission,
    );
  }

  //delete permission fr role
  @Delete('DeletePermissionFromRole/:id')
  async deletePermissionFromRole(@Param('id') id: string): Promise<boolean> {
    return this.rolePermissionService.delete(id);
  }
}
