import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
  UseGuards,
  Patch,
  UseInterceptors,
  Req,
} from '@nestjs/common';
import { LeaveRequestsService } from './leave-requests.service';
import { CreateLeaveRequestDto } from './dto/create-leave-request.dto';
import { UpdateLeaveRequestDto } from './dto/update-leave-request.dto';
import { LeaveRequest } from './entities/leave-request.entity';
import { GetLeaveRequestListDto } from './dto/get-leave-request-list.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { LeaveRequestFilterInterceptor } from 'src/common/interceptors/leave-request-filter.interceptor';
import { UpdateLeaveRequestStatusDto } from './dto/update-leave-request-status.dto';

@ApiBearerAuth()
@UseInterceptors(LeaveRequestFilterInterceptor)
@UseGuards(JwtAuthGuard)
@Controller('LeaveRequests')
export class LeaveRequestsController {
  constructor(private readonly leaveRequestsService: LeaveRequestsService) {}

  //get all leave request
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('leave-request:read')
  @Get('GetAllLeaveRequests')
  async findAll(): Promise<LeaveRequest[]> {
    return await this.leaveRequestsService.findAll();
  }

  //get leave request by id
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('leave-request:read')
  @Get('GetLeaveRequestById/:id')
  async findOne(@Param('id') id: string): Promise<LeaveRequest> {
    return await this.leaveRequestsService.findOne(id);
  }

  //create new leave request
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('leave-request:create')
  @Post('PostLeaveRequest')
  async create(
    @Body() createLeaveRequestDto: CreateLeaveRequestDto,
  ): Promise<LeaveRequest> {
    return await this.leaveRequestsService.create(createLeaveRequestDto);
  }

  //update leave request
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('leave-request:update')
  @Put('PutLeaveRequest/:id')
  async update(
    @Param('id') id: string,
    @Body() updateLeaveRequestDto: UpdateLeaveRequestDto,
  ): Promise<boolean> {
    return await this.leaveRequestsService.update(id, updateLeaveRequestDto);
  }

  //delete leave
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('leave-request:delete')
  @Delete('DeleteLeaveRequest/:id')
  async delete(@Param('id') id: string): Promise<boolean> {
    return await this.leaveRequestsService.delete(id);
  }

  //get leave request list
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('leave-request:read')
  @Get('GetLeaveRequestList')
  async GetLeaveRequestList(@Query() query: GetLeaveRequestListDto) {
    return this.leaveRequestsService.getLeaveRequestList(query);
  }

  //get leave request list
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('leave-request:read')
  @Get('GetLeaveRequestListByEmployeeId')
  async getLeaveRequestList(@Query() query: GetLeaveRequestListDto) {
    return this.leaveRequestsService.getLeaveRequestList({
      ...query,
    });
  }

  //get leave balances by employee id
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('leave-request:read')
  @Get('GetLeaveBalancesByEmployeeId/:employeeId')
  async getLeaveBalances(@Param('employeeId') employeeId: string) {
    return this.leaveRequestsService.getLeaveBalancesByEmployee(employeeId);
  }

  //get leave request list by employe id == my-leave
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('leave-request:read')
  @Get('GetLeaveRequestListByEmployeeId/:employeeId')
  async getLeaveRequestListByEmployeeId(
    @Param('employeeId') employeeId: string,
    @Query() query: GetLeaveRequestListDto,
  ) {
    return this.leaveRequestsService.getLeaveRequestListByEmployeeId(
      employeeId,
      query,
    );
  }

  // get leave request for supervisor(manager)
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('leave-request:read')
  @Get('GetLeaveRequestsForSupervisor/:supervisorId')
  async getLeaveRequestsForSupervisor(
    @Param('supervisorId') supervisorId: string,
    @Query() query: GetLeaveRequestListDto,
  ) {
    return this.leaveRequestsService.getLeaveRequestsForSupervisor(
      supervisorId,
      query,
    );
  }

  // get leave request for director
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('leave-request:read')
  @Get('getLeaveRequestForDirector/:directorId')
  async getLeaveRequestsForDirector(
    @Param('directorId') directorId: string,
    @Query() query: GetLeaveRequestListDto,
  ) {
    return this.leaveRequestsService.getLeaveRequestsForDirector(
      directorId,
      query,
    );
  }

  //update leave request status
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('leave-request:update')
  @Patch('PatchLeaveRequestStatus/:id')
  async updateLeaveRequestStatus(
    @Param('id') id: string,
    @Body() dto: UpdateLeaveRequestStatusDto,
    @Req() req,
  ) {
    const actorId = req.user.userId;
    return this.leaveRequestsService.updateLeaveRequestStatus(id, dto, actorId);
  }
}
