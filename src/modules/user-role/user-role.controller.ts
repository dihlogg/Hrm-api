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
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('User-role')
@Controller('User-role')
export class UserRoleController {
  constructor(private readonly userRoleService: UserRoleService) {}

  //asign role to user
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('user-role:assign')
  @Post('AssignRoleToUser')
  async assignRoleToUser(
    @Body() createUserRoleDto: CreateUserRoleDto,
  ): Promise<UserRole> {
    return await this.userRoleService.assignRoleToUser(createUserRoleDto);
  }

  //revoke role fr user
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('user-role:revoke')
  @Put('RevokeRoleFromUser/:id')
  async revokeRoleFromUser(
    @Param('id') id: string,
    @Body() updateUserRoleDto: UpdateUserRoleDto,
  ): Promise<boolean> {
    return await this.userRoleService.revokeRoleFromUser(id, updateUserRoleDto);
  }
}
