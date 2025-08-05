import { Module } from '@nestjs/common';
import { EmployeeStatusService } from './employee-status.service';
import { EmployeeStatusController } from './employee-status.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeeStatus } from './entities/employee-status.entity';
import { AuthModule } from 'src/modules/auth/auth.module';
import { PermissionsModule } from 'src/modules/permissions/permissions.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([EmployeeStatus]),
    AuthModule,
    PermissionsModule,
  ],
  controllers: [EmployeeStatusController],
  providers: [EmployeeStatusService],
  exports: [TypeOrmModule, EmployeeStatusService],
})
export class EmployeeStatusModule {}
