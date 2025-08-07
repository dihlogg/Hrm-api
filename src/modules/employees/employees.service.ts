import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Employee } from './entities/employee.entity';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { UsersService } from '../users/users.service';
import { DataSource } from 'typeorm';
import { GetEmployeeListDto } from './dto/get-employee-list.dto';
import { PaginationDto } from 'src/common/utils/pagination/pagination.dto';
import { paginateAndFormat } from 'src/common/utils/pagination/pagination.utils';

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

  async getPaginatedEmployees(dto: PaginationDto) {
    const { page = 1, pageSize = 10 } = dto;

    return paginateAndFormat(this.repo, {
      page: Number(page),
      pageSize: Number(pageSize),
      useQueryBuilder: false,
      findOptions: {
        relations: {
          jobTitle: true,
          subUnit: true,
          employeeStatus: true,
        },
        order: {
          createDate: 'DESC',
        },
      },
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

  async updateEmployeeStatus(id: string): Promise<boolean> {
    const ON_LEAVE_STATUS_ID = 'a0ed70e2-05d0-4620-b27a-a4881fe9f5b3';
    const employee = await this.repo.findOne({ where: { id } });

    if (!employee) {
      throw new NotFoundException('Employee not found');
    }
    if (employee.employeeStatusId === ON_LEAVE_STATUS_ID) {
      throw new BadRequestException('This employee is already on leave');
    }

    await this.repo.update(id, { employeeStatusId: ON_LEAVE_STATUS_ID });
    return true;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Employee not found');
    }
    return true;
  }

  async getEmployeeList(dto: GetEmployeeListDto) {
    const { page = 1, pageSize = 10 } = dto;

    let query = this.repo
      .createQueryBuilder('employee')
      .leftJoinAndSelect('employee.jobTitle', 'jobTitle')
      .leftJoinAndSelect('employee.subUnit', 'subUnit')
      .leftJoinAndSelect('employee.employeeStatus', 'employeeStatus');

    query = this.applyFilters(query, dto);
    query = this.applySorting(query, dto);

    return paginateAndFormat(query, {
      page: Number(page),
      pageSize: Number(pageSize),
      useQueryBuilder: true,
      queryBuilder: query,
    });
  }

  private applyFilters(
    query: SelectQueryBuilder<Employee>,
    dto: GetEmployeeListDto,
  ) {
    const { firstName, lastName, employeeStatusId, jobTitleId, subUnitId } =
      dto;

    if (firstName)
      query.andWhere('employee.firstName ILIKE :firstName', {
        firstName: `%${firstName}%`,
      });
    if (lastName)
      query.andWhere('employee.lastName ILIKE :lastName', {
        lastName: `%${lastName}%`,
      });
    if (employeeStatusId)
      query.andWhere('employee.employeeStatusId = :employeeStatusId', {
        employeeStatusId,
      });
    if (jobTitleId)
      query.andWhere('employee.jobTitleId = :jobTitleId', { jobTitleId });
    if (subUnitId)
      query.andWhere('employee.subUnitId = :subUnitId', { subUnitId });

    return query;
  }

  private applySorting(
    query: SelectQueryBuilder<Employee>,
    dto: GetEmployeeListDto,
  ) {
    const sortFieldMap = {
      firstName: 'employee.firstName',
      lastName: 'employee.lastName',
      employeeStatus: 'employeeStatus.name',
      jobTitle: 'jobTitle.name',
      subUnit: 'subUnit.name',
    };

    if (!dto.sortBy || !dto.sortOrder) {
      return query.orderBy('employee.createDate', 'DESC');
    }

    const sortField = sortFieldMap[dto.sortBy];
    const sortOrder = dto.sortOrder;

    return query.orderBy(sortField, sortOrder);
  }
}
