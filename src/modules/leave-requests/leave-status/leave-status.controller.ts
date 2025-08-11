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
import { LeaveStatusService } from './leave-status.service';
import { CreateLeaveStatusDto } from './dto/create-leave-status.dto';
import { UpdateLeaveStatusDto } from './dto/update-leave-status.dto';
import { LeaveStatus } from './entities/leave-status.entity';

@Controller('LeaveStatuses')
export class LeaveStatusController {
  constructor(private readonly leaveStatusService: LeaveStatusService) {}

  //get all leave status
  @Get('GetAllLeaveStatuses')
  async findAll(): Promise<LeaveStatus[]> {
    return await this.leaveStatusService.findAll();
  }

  //get leave status by id
  @Get('GetLeaveStatusById/:id')
  async findOne(@Param('id') id: string): Promise<LeaveStatus> {
    return await this.leaveStatusService.findOne(id);
  }

  //create new leave status
  @Post('PostLeaveStatus')
  async create(
    @Body() createLeaveStatusDto: CreateLeaveStatusDto,
  ): Promise<LeaveStatus> {
    return await this.leaveStatusService.create(createLeaveStatusDto);
  }

  //update leave status
  @Put('PutLeaveStatus/:id')
  async update(
    @Param('id') id: string,
    @Body() updateLeaveStatusDto: UpdateLeaveStatusDto,
  ): Promise<boolean> {
    return await this.leaveStatusService.update(id, updateLeaveStatusDto);
  }

  //delete leave status
  @Delete('DeleteLeaveStatus/:id')
  async delete(@Param('id') id: string): Promise<boolean> {
    return await this.leaveStatusService.delete(id);
  }
}
