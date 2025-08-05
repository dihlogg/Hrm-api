import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Put,
} from '@nestjs/common';
import { EmployeeStatusService } from './employee-status.service';
import { CreateEmployeeStatusDto } from './dto/create-employee-status.dto';
import { UpdateEmployeeStatusDto } from './dto/update-employee-status.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { EmployeeStatus } from './entities/employee-status.entity';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('EmployeeStatuses')
@Controller('EmployeeStatuses')
export class EmployeeStatusController {
  constructor(private readonly employeeStatusService: EmployeeStatusService) {}

  //get all employee statuses
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('employee-status:read')
  @Get('GetAllEmployeeStatuses')
  async findAll(): Promise<EmployeeStatus[]> {
    return await this.employeeStatusService.findAll();
  }

  //get employee status by id
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('employee-status:read')
  @Get('GetEmployeeStatusById/:id')
  async findOne(@Param('id') id: string): Promise<EmployeeStatus> {
    return this.employeeStatusService.findOne(id);
  }

  //create employee status
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('employee-status:create')
  @Post('PostEmployeeStatus')
  async create(
    @Body() createEmployeeStatusDto: CreateEmployeeStatusDto,
  ): Promise<EmployeeStatus> {
    return await this.employeeStatusService.create(createEmployeeStatusDto);
  }

  //update employee status
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('employee-status:update')
  @Put('PutEmployeeStatus/:id')
  async update(
    @Param('id') id: string,
    @Body() updateEmployeeStatusDto: UpdateEmployeeStatusDto,
  ): Promise<boolean> {
    return this.employeeStatusService.update(id, updateEmployeeStatusDto);
  }

  //delete employee status
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('employee-status:delete')
  @Delete('DeleteEmployeeStatus/:id')
  async delete(@Param('id') id: string): Promise<boolean> {
    return this.employeeStatusService.delete(id);
  }
}
