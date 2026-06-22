import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Employee } from './entities/employee.entity';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { UsersService } from '../users/users.service';
import { DataSource } from 'typeorm';
import { GetEmployeeListDto } from './dto/get-employee-list.dto';
import { EmployeeStatus } from './employee-status/entities/employee-status.entity';
import { CloudinaryService } from '../../cloudinary/cloudinary.service';
import { PaginationDto } from '../../common/utils/pagination/pagination.dto';
import { paginateAndFormat } from '../../common/utils/pagination/pagination.util';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employee) private readonly repo: Repository<Employee>,
    @InjectRepository(EmployeeStatus)
    private readonly employeeStatusRepo: Repository<EmployeeStatus>,
    private readonly usersService: UsersService,
    private readonly dataSource: DataSource,
    private readonly cloudinaryService: CloudinaryService,
  ) { }

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

  async createUserAccountForEmployee(
    id: string,
    createUserDto: CreateUserDto,
  ): Promise<boolean> {
    return await this.dataSource.transaction(async (manager) => {
      const employee = await manager.getRepository(Employee).findOne({ where: { id } });
      if (!employee) {
        throw new NotFoundException('Employee not found');
      }
      if (employee.userId) {
        throw new BadRequestException('This employee already has a user account linked');
      }

      const newUser = await this.usersService.create(createUserDto, manager);
      employee.userId = newUser.id;

      const officialStatus = await manager.getRepository(EmployeeStatus).findOne({ where: { statusCode: 'OFFICIAL' } });
      if (officialStatus) {
        employee.employeeStatusId = officialStatus.id;
      }

      await manager.getRepository(Employee).save(employee);
      return true;
    });
  }

  async handleCandidateHiredEvent(payload: any) {
    try {
      const { firstName, lastName, email, phoneNumber, jobTitleId, subUnitId } = payload;

      const tempStatus = await this.employeeStatusRepo.findOne({
        where: { statusCode: 'TEMPORARY' },
      });

      const employee = this.repo.create({
        firstName,
        lastName,
        email,
        phoneNumber,
        jobTitleId,
        subUnitId,
        employeeStatusId: tempStatus?.id,
      });

      await this.repo.save(employee);
      console.log(`Successfully created temporary employee for hired candidate: ${email}`);
    } catch (error) {
      console.error('Failed to create employee from candidate hired event:', error);
      // Let it throw or handle DLQ logic later if needed
      throw error;
    }
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
    const employee = await this.repo.findOne({ where: { id } });
    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    const oldImageUrl = employee.imageUrl;

    await this.repo.update(id, updateEmployeeDto);

    if (
      updateEmployeeDto.imageUrl !== undefined &&
      updateEmployeeDto.imageUrl !== oldImageUrl &&
      oldImageUrl
    ) {
      // Xóa ảnh cũ trên Cloudinary (chạy nền)
      this.cloudinaryService.deleteImageByUrl(oldImageUrl).catch((err) => {
        console.error('Failed to delete old avatar on Cloudinary', err);
      });
    }

    return true;
  }

  async updateEmployeeStatus(id: string): Promise<boolean> {
    const status = await this.employeeStatusRepo.findOne({
      where: { statusCode: 'ON_LEAVE' },
    });
    if (!status) {
      throw new NotFoundException('Status ON_LEAVE not found in database');
    }
    const employee = await this.repo.findOne({ where: { id } });
    if (!employee) {
      throw new NotFoundException('Employee not found');
    }
    if (employee.employeeStatusId === status.id) {
      throw new BadRequestException('This employee is already on leave');
    }

    await this.repo.update(id, { employeeStatusId: status.id });
    return true;
  }

  async delete(id: string): Promise<boolean> {
    const employee = await this.repo.findOne({ where: { id } });
    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    const imageUrlToDelete = employee.imageUrl;

    const result = await this.repo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Employee not found');
    }

    if (imageUrlToDelete) {
      this.cloudinaryService.deleteImageByUrl(imageUrlToDelete).catch((err) => {
        console.error('Failed to delete avatar on Cloudinary', err);
      });
    }

    return true;
  }

  async getEmployeeDetailsByUserId(userId: string): Promise<Employee> {
    const employee = await this.repo.findOne({
      where: { userId },
      relations: {
        jobTitle: true,
        subUnit: true,
        employeeStatus: true,
      },
    });

    if (!employee) {
      throw new NotFoundException('Employee not found for this user');
    }
    return employee;
  }

  async getEmployeesBySubUnit(
    subUnitId: string,
    employeeId: string,
  ): Promise<Employee[]> {
    return await this.repo
      .createQueryBuilder('employee')
      .leftJoinAndSelect('employee.jobTitle', 'jobTitle')
      .leftJoinAndSelect('employee.subUnit', 'subUnit')
      .leftJoinAndSelect('employee.employeeStatus', 'employeeStatus')
      .where('employee.subUnitId = :subUnitId', { subUnitId })
      .andWhere('employee.id != :employeeId', { employeeId })
      .getMany();
  }

  async getParentEmployee(): Promise<Employee[]> {
    return await this.repo
      .createQueryBuilder('employee')
      .leftJoin('employee.user', 'user') // join sang Users
      .leftJoin('user.userRole', 'userRole') // join sang UserRole
      .leftJoin('userRole.role', 'role') // join sang Roles
      .where('role.name IN (:...roleNames)', {
        roleNames: ['Admin', 'Super Admin'],
      })
      .getMany();
  }

  async getDirectorBySubUnit(subUnitId: string): Promise<Employee[]> {
    return await this.repo
      .createQueryBuilder('employee')
      .leftJoinAndSelect('employee.subUnit', 'subUnit')
      .leftJoinAndSelect('employee.jobTitle', 'jobTitle')
      .leftJoinAndSelect('employee.employeeStatus', 'employeeStatus')
      .leftJoin('employee.user', 'user') // join sang Users
      .leftJoin('user.userRole', 'userRole') // join sang UserRole
      .leftJoin('userRole.role', 'role') // join sang Roles
      .where('employee.subUnitId = :subUnitId', { subUnitId })
      .andWhere('role.name = :roleName', { roleName: 'Super Admin' })
      .getMany();
  }

  async getSupervisorEmployee(employeeId: string): Promise<Employee | null> {
    const employee = await this.repo.findOne({
      where: { id: employeeId },
      relations: { supervisor: true },
    });

    return employee?.supervisor || null;
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
      createDate: 'employee.createDate',
    };

    if (!dto.sortBy || !dto.sortOrder) {
      return query.orderBy('employee.createDate', 'DESC');
    }

    const sortField = sortFieldMap[dto.sortBy];
    const sortOrder = dto.sortOrder;

    return query.orderBy(sortField, sortOrder);
  }
}
