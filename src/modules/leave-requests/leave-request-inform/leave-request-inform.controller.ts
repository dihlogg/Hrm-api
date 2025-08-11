import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LeaveRequestInformService } from './leave-request-inform.service';
import { CreateLeaveRequestInformDto } from './dto/create-leave-request-inform.dto';
import { UpdateLeaveRequestInformDto } from './dto/update-leave-request-inform.dto';

@Controller('leave-request-inform')
export class LeaveRequestInformController {
  constructor(private readonly leaveRequestInformService: LeaveRequestInformService) {}

  @Post()
  create(@Body() createLeaveRequestInformDto: CreateLeaveRequestInformDto) {
    return this.leaveRequestInformService.create(createLeaveRequestInformDto);
  }

  @Get()
  findAll() {
    return this.leaveRequestInformService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.leaveRequestInformService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLeaveRequestInformDto: UpdateLeaveRequestInformDto) {
    return this.leaveRequestInformService.update(+id, updateLeaveRequestInformDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.leaveRequestInformService.remove(+id);
  }
}
