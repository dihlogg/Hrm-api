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
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entities/role.entity';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Roles')
@Controller('Roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  //get all roles
  @Get('GetAllRoles')
  async findAll(): Promise<Role[]> {
    return await this.rolesService.findAll();
  }

  //get role by id
  @Get('GetRoleById/:id')
  async findOne(@Param('id') id: string): Promise<Role> {
    return await this.rolesService.findOne(id);
  }

  //create role
  @Post('PostNewRole')
  async create(@Body() createRoleDto: CreateRoleDto): Promise<Role> {
    return await this.rolesService.create(createRoleDto);
  }

  //update role
  @Put('PutRole/:id')
  async update(
    @Param('id') id: string,
    @Body() updateRoleDto: UpdateRoleDto,
  ): Promise<boolean> {
    return await this.rolesService.update(id, updateRoleDto);
  }

  //delete role
  @Delete('DeleteRole/:id')
  async delete(@Param('id') id: string): Promise<boolean> {
    return await this.rolesService.delete(id);
  }
}
