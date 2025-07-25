import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { ApiTags } from '@nestjs/swagger';
import { Permission } from './entities/permission.entity';

@ApiTags('Permissions')
@Controller('Permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  //get all permissions
  @Get('GetAllPermissions')
  async findAll(): Promise<Permission[]> {
    return await this.permissionsService.findAll();
  }

  //get permission by id
  @Get('GetPermissionById/:id')
  async findOne(@Param('id') id: string): Promise<Permission> {
    return this.permissionsService.findOne(id);
  }

  //create new permission
  @Post('PostPermission')
  async create(
    @Body() createPermissionDto: CreatePermissionDto,
  ): Promise<Permission> {
    return await this.permissionsService.create(createPermissionDto);
  }

  //update permission
  @Put('PutPermission/:id')
  async update(
    @Param('id') id: string,
    @Body() updatePermissionDto: UpdatePermissionDto,
  ): Promise<boolean> {
    return this.permissionsService.update(id, updatePermissionDto);
  }

  //delete permission
  @Delete('DeletePermission/:id')
  async delete(@Param('id') id: string): Promise<boolean> {
    return this.permissionsService.delete(id);
  }

  //Lấy danh sách role được gán quyền theo permissionId
  @Get('GetRolesByPermissionId/:id')
  async getRolesByPermissionId(@Param('id') id: string) {
    return this.permissionsService.getRolesByPermissionId(id);
  }

  //Lấy danh sách permissions được gán cho role theo roleId
  @Get('GetPermissionsByRoleId/:id')
  async GetPermissionsByRoleId(@Param('id') id: string) {
    return this.permissionsService.getPermissionsByRoleId(id);
  }

  //Lấy danh sách user được cấp quyền theo permissionId
  @Get('GetUsersByPermissionId/:id')
  async getUsersOfPermission(@Param('id') id: string) {
    return await this.permissionsService.getUsersByPermissionId(id);
  }
}
