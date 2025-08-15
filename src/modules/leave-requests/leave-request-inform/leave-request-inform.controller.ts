import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { LeaveRequestInformService } from './leave-request-inform.service';
import {
  CreateLeaveRequestParticipantsDto,
  CreateLeaveRequestWithManyParticipantsDto,
} from './dto/create-leave-request-participants.dto';
import { UpdateLeaveRequestParticipantsDto } from './dto/update-leave-request-participants.dto';
import { LeaveRequestParticipants } from './entities/leave-request-inform.entity';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('LeaveRequestParticipants')
@Controller('LeaveRequestParticipants')
export class LeaveRequestInformController {
  constructor(
    private readonly leaveRequestInformService: LeaveRequestInformService,
  ) {}

  //get all
  @Get('GetAllLeaveRequestParticipants')
  async findAll(): Promise<LeaveRequestParticipants[]> {
    return this.leaveRequestInformService.findAll();
  }

  //get by id
  @Get('GetLeaveRequestParticipantById/:id')
  async findOne(@Param('id') id: string): Promise<LeaveRequestParticipants> {
    return this.leaveRequestInformService.findOne(id);
  }

  //create
  @Post('PostLeaveRequestParticipant')
  async create(
    @Body() createRequetDto: CreateLeaveRequestParticipantsDto,
  ): Promise<LeaveRequestParticipants> {
    return this.leaveRequestInformService.create(createRequetDto);
  }

  //create with 2 participants
  @Post('PostLeaveRequestParticipants')
  async createMultiple(
    @Body() dto: CreateLeaveRequestWithManyParticipantsDto,
  ): Promise<boolean> {
    return this.leaveRequestInformService.createMultiple(dto);
  }

  //update
  @Put('PutLeaveRequestParticipant/:id')
  async update(
    @Param('id') id: string,
    @Body() updateRequetDto: UpdateLeaveRequestParticipantsDto,
  ): Promise<boolean> {
    return this.leaveRequestInformService.update(id, updateRequetDto);
  }

  //delete
  @Delete('DeleteLeaveRequestParticipant/:id')
  async delete(@Param('id') id: string): Promise<boolean> {
    return this.leaveRequestInformService.delete(id);
  }
}
