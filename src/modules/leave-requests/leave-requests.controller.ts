import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
} from '@nestjs/common';
import { LeaveRequestsService } from './leave-requests.service';
import { CreateLeaveRequestDto } from './dto/create-leave-request.dto';
import { UpdateLeaveRequestDto } from './dto/update-leave-request.dto';
import { LeaveRequest } from './entities/leave-request.entity';
import { GetLeaveRequestListDto } from './dto/get-leave-request-list.dto';

@Controller('leave-requests')
export class LeaveRequestsController {
  constructor(private readonly leaveRequestsService: LeaveRequestsService) {}

  //get all leave request
  @Get('GetAllLeaveRequests')
  async findAll(): Promise<LeaveRequest[]> {
    return await this.leaveRequestsService.findAll();
  }

  //get leave request by id
  @Get('GetLeaveRequestById/:id')
  async findOne(@Param('id') id: string): Promise<LeaveRequest> {
    return await this.leaveRequestsService.findOne(id);
  }

  //create new leave request
  @Post('PostLeaveRequest')
  async create(
    @Body() createLeaveRequestDto: CreateLeaveRequestDto,
  ): Promise<LeaveRequest> {
    return await this.leaveRequestsService.create(createLeaveRequestDto);
  }

  //update leave request
  @Put('PutLeaveRequest/:id')
  async update(
    @Param('id') id: string,
    @Body() updateLeaveRequestDto: UpdateLeaveRequestDto,
  ): Promise<boolean> {
    return await this.leaveRequestsService.update(id, updateLeaveRequestDto);
  }

  //delete leave request
  @Delete('DeleteLeaveRequest/:id')
  async delete(@Param('id') id: string): Promise<boolean> {
    return await this.leaveRequestsService.delete(id);
  }

  @Get('GetLeaveRequestList')
  async GetLeaveRequestList(@Query() query: GetLeaveRequestListDto) {
    return this.leaveRequestsService.getLeaveRequestList(query);
  }
}
