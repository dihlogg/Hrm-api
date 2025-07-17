import { Delete, Injectable, NotFoundException } from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Employee } from './entities/employee.entity';
import { Repository } from 'typeorm';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employee) private readonly repo: Repository<Employee>,
  ) {}

  async create(createEmployeeDto: CreateEmployeeDto): Promise<Employee> {
    const employee = this.repo.create(createEmployeeDto);
    return await this.repo.save(createEmployeeDto);
  }

  async findAll(): Promise<Employee[]> {
    return await this.repo.find();
  }

  async findOne(id: string): Promise<Employee> {
    const employee = await this.repo.findOne({ where: { id } });
    if (!employee) {
      throw new NotFoundException('Employee not found');
    }
    return employee;
  }

  async update(
    id: string,
    updateEmployeeDto: UpdateEmployeeDto,
  ): Promise<boolean> {
    await this.repo.update(id, updateEmployeeDto);
    const updateEmployee = await this.repo.findOne({ where: { id } });
    if (!updateEmployee) {
      throw new NotFoundException('Employee not found');
    }
    return true;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Employee not found');
    }
    return true;
  }
}
