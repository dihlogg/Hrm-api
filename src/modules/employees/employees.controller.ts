import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
  Query,
} from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Employee } from './entities/employee.entity';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { GetEmployeeListDto } from './dto/get-employee-list.dto';
import { PaginationDto } from 'src/common/utils/pagination/pagination.dto';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Employees')
@Controller('Employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  //get all employees with pagination
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('employee:read')
  @Get('GetAllEmployees')
  async getPaginatedEmployees(@Query() query: PaginationDto) {
    return this.employeesService.getPaginatedEmployees(query);
  }

  //get employee by id
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('employee:read')
  @Get('GetEmployeeById/:id')
  async findOne(@Param('id') id: string): Promise<Employee> {
    return this.employeesService.findOne(id);
  }

  //create new employee
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('employee:create')
  @Post('PostEmployee')
  async create(
    @Body() createEmployeeDto: CreateEmployeeDto,
  ): Promise<Employee> {
    return await this.employeesService.create(createEmployeeDto);
  }

  //update employee
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('employee:update')
  @Put('PutEmployee/:id')
  async update(
    @Param('id') id: string,
    @Body() updateEmployeeDto: UpdateEmployeeDto,
  ): Promise<boolean> {
    return await this.employeesService.update(id, updateEmployeeDto);
  }

  //delete empoyee
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('employee:delete')
  @Delete('DeleteEmployee/:id')
  async delete(@Param('id') id: string): Promise<boolean> {
    return await this.employeesService.delete(id);
  }

  //sorting and pagination employees with filters
  @Get('GetEmployeeList')
  async getEmployeeList(@Query() query: GetEmployeeListDto) {
    return this.employeesService.getEmployeeList(query);
  }
}
