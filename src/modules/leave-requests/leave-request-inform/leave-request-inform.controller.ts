import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
} from '@nestjs/common';
import { LeaveRequestInformService } from './leave-request-inform.service';
import {
  CreateLeaveRequestParticipantsDto,
  CreateLeaveRequestWithManyParticipantsDto,
} from './dto/create-leave-request-participants.dto';
import { UpdateLeaveRequestParticipantsDto } from './dto/update-leave-request-participants.dto';
import { LeaveRequestParticipants } from './entities/leave-request-inform.entity';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('LeaveRequestParticipants')
@Controller('LeaveRequestParticipants')
export class LeaveRequestInformController {
  constructor(
    private readonly leaveRequestInformService: LeaveRequestInformService,
  ) {}

  //get all
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('leave-request-participant:read')
  @Get('GetAllLeaveRequestParticipants')
  async findAll(): Promise<LeaveRequestParticipants[]> {
    return this.leaveRequestInformService.findAll();
  }

  //get by id
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('leave-request-participant:read')
  @Get('GetLeaveRequestParticipantById/:id')
  async findOne(@Param('id') id: string): Promise<LeaveRequestParticipants> {
    return this.leaveRequestInformService.findOne(id);
  }

  //create
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('leave-request-participant:create')
  @Post('PostLeaveRequestParticipant')
  async create(
    @Body() createRequetDto: CreateLeaveRequestParticipantsDto,
  ): Promise<LeaveRequestParticipants> {
    return this.leaveRequestInformService.create(createRequetDto);
  }

  //create with 2 participants
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('leave-request-participant:create')
  @Post('PostLeaveRequestParticipants')
  async createMultiple(
    @Body() dto: CreateLeaveRequestWithManyParticipantsDto,
  ): Promise<boolean> {
    return this.leaveRequestInformService.createMultiple(dto);
  }

  //update
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('leave-request-participant:update')
  @Put('PutLeaveRequestParticipant/:id')
  async update(
    @Param('id') id: string,
    @Body() updateRequetDto: UpdateLeaveRequestParticipantsDto,
  ): Promise<boolean> {
    return this.leaveRequestInformService.update(id, updateRequetDto);
  }

  //delete
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('leave-request-participant:delete')
  @Delete('DeleteLeaveRequestParticipant/:id')
  async delete(@Param('id') id: string): Promise<boolean> {
    return this.leaveRequestInformService.delete(id);
  }
}
