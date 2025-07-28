import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { RolePermissionService } from './role-permission.service';
import { CreateRolePermissionDto } from './dto/create-role-permission.dto';
import { UpdateRolePermissionDto } from './dto/update-role-permission.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RolePermission } from './entities/role-permission.entity';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Role-permission')
@Controller('Role-permission')
export class RolePermissionController {
  constructor(private readonly rolePermissionService: RolePermissionService) {}

  //get all role permissions
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('role-permission:read')
  @Get('GetAllRolePermissions')
  async findAll(): Promise<RolePermission[]> {
    return await this.rolePermissionService.findAll();
  }

  //assign permissions to roles
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('role-permission:assign')
  @Post('AssignPermissionToRole')
  async assignPermissionToRole(
    @Body() createRolePermission: CreateRolePermissionDto,
  ): Promise<RolePermission> {
    return await this.rolePermissionService.assignPermissionToRole(
      createRolePermission,
    );
  }

  //delete permission fr role
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('role-permission:delete')
  @Delete('DeletePermissionFromRole/:id')
  async deletePermissionFromRole(@Param('id') id: string): Promise<boolean> {
    return this.rolePermissionService.delete(id);
  }
}
