import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { LeaveReasonService } from './leave-reason.service';
import { CreateLeaveReasonDto } from './dto/create-leave-reason.dto';
import { UpdateLeaveReasonDto } from './dto/update-leave-reason.dto';
import { LeaveReason } from './entities/leave-reason.entity';

@Controller('LeaveReasons')
export class LeaveReasonController {
  constructor(private readonly leaveReasonService: LeaveReasonService) {}

  //get all leave reason
  @Get('GetAllLeaveReasons')
  async findAll(): Promise<LeaveReason[]> {
    return await this.leaveReasonService.findAll();
  }

  //get leave reason by id
  @Get('GetLeaveReasonById/:id')
  async findOne(@Param('id') id: string): Promise<LeaveReason> {
    return await this.leaveReasonService.findOne(id);
  }

  //create new leave reason
  @Post('PostLeaveReason')
  async create(
    @Body() createLeaveReasonDto: CreateLeaveReasonDto,
  ): Promise<LeaveReason> {
    return await this.leaveReasonService.create(createLeaveReasonDto);
  }

  //update leave reason
  @Put('PutLeaveReason/:id')
  async update(
    @Param('id') id: string,
    @Body() updateLeaveReasonDto: UpdateLeaveReasonDto,
  ): Promise<boolean> {
    return await this.leaveReasonService.update(id, updateLeaveReasonDto);
  }

  //delete leave reason
  @Delete('DeleteLeaveReason/:id')
  async delete(@Param('id') id: string): Promise<boolean> {
    return await this.leaveReasonService.delete(id);
  }
}
