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
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserStatusService } from './user-status.service';
import { UserStatus } from './entities/user-status.entity';
import { CreateUserStatusDto } from './dto/create-user-status.dto';
import { UpdateUserStatusDto } from './dto/update-user-status.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('UserStatus')
@Controller('UserStatuses')
export class UserStatusController {
  constructor(private readonly userStatusService: UserStatusService) {}

  //get all user statuses
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('user-status:read')
  @Get('GetAllUserStatuses')
  async findAll(): Promise<UserStatus[]> {
    return await this.userStatusService.findAll();
  }

  //get user status by id
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('user-status:read')
  @Get('GetUserStatusById/:id')
  async findOne(@Param('id') id: string): Promise<UserStatus> {
    return this.userStatusService.findOne(id);
  }

  //create user status
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('user-status:create')
  @Post('PostUserStatus')
  async create(
    @Body() createUserStatusDto: CreateUserStatusDto,
  ): Promise<UserStatus> {
    return await this.userStatusService.create(createUserStatusDto);
  }

  //update user status
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('user-status:update')
  @Put('PutUserStatus/:id')
  async update(
    @Param('id') id: string,
    @Body() updateUserStatusDto: UpdateUserStatusDto,
  ): Promise<boolean> {
    return this.userStatusService.update(id, updateUserStatusDto);
  }

  //delete user status
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('user-status:delete')
  @Delete('DeleteUserStatus/:id')
  async delete(@Param('id') id: string): Promise<boolean> {
    return this.userStatusService.delete(id);
  }

  @Get('SortUserStatusesByName')
  async sortByName(
    @Query('sortOrder') sortOrder: 'ASC' | 'DESC' = 'ASC',
  ): Promise<UserStatus[]> {
    return this.userStatusService.sortByName(sortOrder);
  }
}
