import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEmployeeStatusDto } from './dto/create-employee-status.dto';
import { UpdateEmployeeStatusDto } from './dto/update-employee-status.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { EmployeeStatus } from './entities/employee-status.entity';
import { Repository } from 'typeorm';

@Injectable()
export class EmployeeStatusService {
  constructor(
    @InjectRepository(EmployeeStatus)
    private readonly repo: Repository<EmployeeStatus>,
  ) {}

  async create(
    createEmployeeStatusDto: CreateEmployeeStatusDto,
  ): Promise<EmployeeStatus> {
    const employeeStatus = this.repo.create(createEmployeeStatusDto);
    return await this.repo.save(employeeStatus);
  }

  async findAll(): Promise<EmployeeStatus[]> {
    return await this.repo.find({
      order: {
        displayOrder: 'ASC',
      },
    });
  }

  async findOne(id: string): Promise<EmployeeStatus> {
    const employeeStatus = await this.repo.findOne({ where: { id } });
    if (!employeeStatus) {
      throw new NotFoundException('Employee status not found');
    }
    return employeeStatus;
  }

  async update(
    id: string,
    updateEmployeeStatusDto: UpdateEmployeeStatusDto,
  ): Promise<boolean> {
    await this.repo.update(id, updateEmployeeStatusDto);
    const updatedEmployeeStatus = await this.repo.findOne({ where: { id } });
    if (!updatedEmployeeStatus) {
      throw new NotFoundException('Employee status not found');
    }
    return true;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Employee status not found');
    }
    return true;
  }
}
