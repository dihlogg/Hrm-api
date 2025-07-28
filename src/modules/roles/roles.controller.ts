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
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entities/role.entity';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Roles')
@Controller('Roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  //get all roles
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('role:read')
  @Get('GetAllRoles')
  async findAll(): Promise<Role[]> {
    return await this.rolesService.findAll();
  }

  //get role by id
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('role:read')
  @Get('GetRoleById/:id')
  async findOne(@Param('id') id: string): Promise<Role> {
    return await this.rolesService.findOne(id);
  }

  //create role
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('role:create')
  @Post('PostNewRole')
  async create(@Body() createRoleDto: CreateRoleDto): Promise<Role> {
    return await this.rolesService.create(createRoleDto);
  }

  //update role
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('role:update')
  @Put('PutRole/:id')
  async update(
    @Param('id') id: string,
    @Body() updateRoleDto: UpdateRoleDto,
  ): Promise<boolean> {
    return await this.rolesService.update(id, updateRoleDto);
  }

  //delete role
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('role:delete')
  @Delete('DeleteRole/:id')
  async delete(@Param('id') id: string): Promise<boolean> {
    return await this.rolesService.delete(id);
  }
}
