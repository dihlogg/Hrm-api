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
import { UserStatusService } from './user-status.service';
import { CreateUserStatusDto } from './dto/create-user-status.dto';
import { UpdateUserStatusDto } from './dto/update-user-status.dto';
import { ApiTags } from '@nestjs/swagger';
import { UserStatus } from './entities/user-status.entity';

@ApiTags('UserStatus')
@Controller('UserStatuses')
export class UserStatusController {
  constructor(private readonly userStatusService: UserStatusService) {}

  //get all user statuses
  @Get('GetAllUserStatuses')
  async findAll(): Promise<UserStatus[]> {
    return await this.userStatusService.findAll();
  }

  //get user status by id
  @Get('GetUserStatusById/:id')
  async findOne(@Param('id') id: string): Promise<UserStatus> {
    return this.userStatusService.findOne(id);
  }

  //create user status
  @Post('PostUserStatus')
  async create(
    @Body() createUserStatusDto: CreateUserStatusDto,
  ): Promise<UserStatus> {
    return await this.userStatusService.create(createUserStatusDto);
  }

  //update user status
  @Put('PutUserStatus/:id')
  async update(
    @Param('id') id: string,
    @Body() updateUserStatusDto: UpdateUserStatusDto,
  ): Promise<boolean> {
    return this.userStatusService.update(id, updateUserStatusDto);
  }

  //delete user status
  @Delete('DeleteUserStatus/:id')
  async delete(@Param('id') id: string): Promise<boolean> {
    return this.userStatusService.delete(id);
  }
}
