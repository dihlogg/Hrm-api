import { Module } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { EmployeesController } from './employees.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee } from './entities/employee.entity';
import { JobTitleModule } from './job-title/job-title.module';
import { SubUnitModule } from './sub-unit/sub-unit.module';
import { UsersModule } from '../users/users.module';
import { EmployeeStatusModule } from './employee-status/employee-status.module';
import { CloudinaryModule } from '../../cloudinary/cloudinary.module';

@Module({
  imports: [TypeOrmModule.forFeature([Employee]), JobTitleModule, SubUnitModule, UsersModule, EmployeeStatusModule, CloudinaryModule],
  controllers: [EmployeesController],
  providers: [EmployeesService],
  exports: [TypeOrmModule, EmployeesService],
})
export class EmployeesModule {}
