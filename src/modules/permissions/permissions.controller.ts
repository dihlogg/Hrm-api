import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  UseGuards,
} from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Permission } from './entities/permission.entity';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Permissions')
@Controller('Permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  //get all permissions
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('permission:read')
  @Get('GetAllPermissions')
  async findAll(): Promise<Permission[]> {
    return await this.permissionsService.findAll();
  }

  //get permission by id
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('permission:read')
  @Get('GetPermissionById/:id')
  async findOne(@Param('id') id: string): Promise<Permission> {
    return this.permissionsService.findOne(id);
  }

  //create new permission
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('permission:create')
  @Post('PostPermission')
  async create(
    @Body() createPermissionDto: CreatePermissionDto,
  ): Promise<Permission> {
    return await this.permissionsService.create(createPermissionDto);
  }

  //update permission
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('permission:update')
  @Put('PutPermission/:id')
  async update(
    @Param('id') id: string,
    @Body() updatePermissionDto: UpdatePermissionDto,
  ): Promise<boolean> {
    return this.permissionsService.update(id, updatePermissionDto);
  }

  //delete permission
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('permission:delete')
  @Delete('DeletePermission/:id')
  async delete(@Param('id') id: string): Promise<boolean> {
    return this.permissionsService.delete(id);
  }

  //Lấy danh sách role được gán quyền theo permissionId
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('permission:get-roles-by-permissionId')
  @Get('GetRolesByPermissionId/:id')
  async getRolesByPermissionId(@Param('id') id: string) {
    return this.permissionsService.getRolesByPermissionId(id);
  }

  //Lấy danh sách permissions được gán cho role theo roleId
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('permission:get-permission-by-roleId')
  @Get('GetPermissionsByRoleId/:id')
  async GetPermissionsByRoleId(@Param('id') id: string) {
    return this.permissionsService.getPermissionsByRoleId(id);
  }

  //Lấy danh sách user được cấp quyền theo permissionId
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('permission:get-users-by-permissionId')
  @Get('GetUsersByPermissionId/:id')
  async getUsersOfPermission(@Param('id') id: string) {
    return await this.permissionsService.getUsersByPermissionId(id);
  }
}
