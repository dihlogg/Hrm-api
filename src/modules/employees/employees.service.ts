import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Employee } from './entities/employee.entity';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { DataSource } from 'typeorm';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employee) private readonly repo: Repository<Employee>,
    private readonly usersService: UsersService,
    private readonly dataSource: DataSource,
  ) {}

  async create(createEmployeeDto: CreateEmployeeDto): Promise<Employee> {
    return await this.dataSource.transaction(async (manager) => {
      const { createLogin = false, user, ...employeeData } = createEmployeeDto;

      let userId: string | undefined;

      if (createLogin) {
        if (!user) {
          throw new Error('Missing user info while createLogin is true.');
        }

        const newUser = await this.usersService.create(user, manager);
        userId = newUser.id;
      }
      const employeeToCreate = {
        ...employeeData,
        ...(userId && { userId }),
      };

      const employee = manager.getRepository(Employee).create(employeeToCreate);
      return await manager.getRepository(Employee).save(employee);
    });
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
