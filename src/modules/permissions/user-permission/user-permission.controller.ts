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
import { UserPermissionService } from './user-permission.service';
import { CreateUserPermissionDto } from './dto/create-user-permission.dto';
import { UpdateUserPermissionDto } from './dto/update-user-permission.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserPermission } from './entities/user-permission.entity';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('User-permission')
@Controller('User-permission')
export class UserPermissionController {
  constructor(private readonly userPermissionService: UserPermissionService) {}

  //get all user permissions
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('user-permission:read')
  @Get('GetAllUserPermissions')
  async findAll(): Promise<UserPermission[]> {
    return await this.userPermissionService.findAll();
  }

  //assign permission to user
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('user-permission:assign')
  @Post('AssignPermissionToUser')
  async assignPermissionToUser(
    @Body() createUserPermission: CreateUserPermissionDto,
  ): Promise<UserPermission> {
    return await this.userPermissionService.assignPermissionToUser(
      createUserPermission,
    );
  }

  //change status is_granted true/false
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('user-permission:change-status')
  @Put('changeStatusGranted')
  async changeStatusGranted(
    @Body() updateUserPermission: UpdateUserPermissionDto,
    @Param('id') id: string,
  ): Promise<boolean> {
    return await this.userPermissionService.changeStatusGranted(
      id,
      updateUserPermission,
    );
  }

  //Delete permission from user
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('user-permission:delete')
  @Delete('DeletePermissionFromUser/:id')
  async deletePermissionFromUser(@Param('id') id: string): Promise<boolean> {
    return this.userPermissionService.deletePermissionFromUser(id);
  }
}
