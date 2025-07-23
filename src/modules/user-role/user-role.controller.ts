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
import { UserRoleService } from './user-role.service';
import { CreateUserRoleDto } from './dto/create-user-role.dto';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { UserRole } from './entities/user-role.entity';
import { ApiTags } from '@nestjs/swagger';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('UserRole')
@Controller('UserRole')
export class UserRoleController {
  constructor(private readonly userRoleService: UserRoleService) {}

  //asign role to user
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin', 'Super Admin')
  @Post('AssignRoleToUser')
  async assignRoleToUser(
    @Body() createUserRoleDto: CreateUserRoleDto,
  ): Promise<UserRole> {
    return await this.userRoleService.assignRoleToUser(createUserRoleDto);
  }

  //revoke role fr user
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Super Admin')
  @Put('RevokeRoleFromUser/:id')
  async revokeRoleFromUser(
    @Param('id') id: string,
    @Body() updateUserRoleDto: UpdateUserRoleDto,
  ): Promise<boolean> {
    return await this.userRoleService.revokeRoleFromUser(id, updateUserRoleDto);
  }
}
