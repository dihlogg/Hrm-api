import { Module } from '@nestjs/common';
import { EmployeeStatusService } from './employee-status.service';
import { EmployeeStatusController } from './employee-status.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeeStatus } from './entities/employee-status.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([EmployeeStatus]),
  ],
  controllers: [EmployeeStatusController],
  providers: [EmployeeStatusService],
  exports: [TypeOrmModule, EmployeeStatusService],
})
export class EmployeeStatusModule {}
