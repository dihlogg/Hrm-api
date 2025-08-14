import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { LeaveRequestTypeService } from './leave-request-type.service';
import { CreateLeaveRequestTypeDto } from './dto/create-leave-request-type.dto';
import { UpdateLeaveRequestTypeDto } from './dto/update-leave-request-type.dto';
import { LeaveRequestType } from './entities/leave-request-type.entity';

@Controller('LeaveRequestTypes')
export class LeaveRequestTypeController {
  constructor(
    private readonly leaveRequestTypeService: LeaveRequestTypeService,
  ) {}

  //get all leave request type
  @Get('GetAllLeaveRequestTypes')
  async findAll(): Promise<LeaveRequestType[]> {
    return await this.leaveRequestTypeService.findAll();
  }

  //get leave request type by id
  @Get('GetLeaveRequestTypeById/:id')
  async findOne(@Param('id') id: string): Promise<LeaveRequestType> {
    return await this.leaveRequestTypeService.findOne(id);
  }

  //create new leave request type
  @Post('PostLeaveRequestType')
  async create(
    @Body() createLeaveRequestTypeDto: CreateLeaveRequestTypeDto,
  ): Promise<LeaveRequestType> {
    return await this.leaveRequestTypeService.create(createLeaveRequestTypeDto);
  }

  //update leave request type
  @Put('PutLeaveRequestType/:id')
  async update(
    @Param('id') id: string,
    @Body() updateLeaveRequestTypeDto: UpdateLeaveRequestTypeDto,
  ): Promise<boolean> {
    return await this.leaveRequestTypeService.update(
      id,
      updateLeaveRequestTypeDto,
    );
  }

  //delete leave request type
  @Delete('DeleteLeaveRequestType/:id')
  async delete(@Param('id') id: string): Promise<boolean> {
    return await this.leaveRequestTypeService.delete(id);
  }
}
