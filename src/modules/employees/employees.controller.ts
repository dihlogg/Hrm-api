import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { ApiTags } from '@nestjs/swagger';
import { Employee } from './entities/employee.entity';

@ApiTags('Employees')
@Controller('Employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  //get all employees
  @Get('GetAllEmployees')
  async findAll(): Promise<Employee[]> {
    return await this.employeesService.findAll();
  }

  //get employee by id
  @Get('GetEmployeeById/:id')
  async findOne(@Param('id') id: string): Promise<Employee> {
    return this.employeesService.findOne(id);
  }

  //create new employee
  @Post('PostEmployee')
  async create(
    @Body() createEmployeeDto: CreateEmployeeDto,
  ): Promise<Employee> {
    return await this.employeesService.create(createEmployeeDto);
  }

  //update employee
  @Put('PutEmployee/:id')
  async update(
    @Param('id') id: string,
    @Body() updateEmployeeDto: UpdateEmployeeDto,
  ): Promise<boolean> {
    return await this.employeesService.update(id, updateEmployeeDto);
  }

  //delete empoyee
  @Delete('DeleteEmployee/:id')
  async delete(@Param('id') id: string): Promise<boolean> {
    return await this.employeesService.delete(id);
  }
}
