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
}
