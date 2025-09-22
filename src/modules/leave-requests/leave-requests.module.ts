import { Module } from '@nestjs/common';
import { LeaveRequestsService } from './leave-requests.service';
import { LeaveRequestsController } from './leave-requests.controller';
import { LeaveStatusModule } from './leave-status/leave-status.module';
import { PartialDayModule } from './partial-day/partial-day.module';
import { LeaveReasonModule } from './leave-reason/leave-reason.module';
import { LeaveRequestInformModule } from './leave-request-inform/leave-request-inform.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LeaveRequest } from './entities/leave-request.entity';
import { EmployeesModule } from '../employees/employees.module';
import { LeaveRequestTypeModule } from './leave-request-type/leave-request-type.module';
import { AuthModule } from '../auth/auth.module';
import { PermissionsModule } from '../permissions/permissions.module';
import { LeavePolicyModule } from './leave-policy/leave-policy.module';
import { RabbitMQModule } from 'src/rabbitmq/rabbitmq.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([LeaveRequest]),
    LeaveStatusModule,
    PartialDayModule,
    LeaveReasonModule,
    LeaveRequestInformModule,
    EmployeesModule,
    LeaveRequestTypeModule,
    AuthModule,
    PermissionsModule,
    LeavePolicyModule,
    RabbitMQModule
  ],
  controllers: [LeaveRequestsController],
  providers: [LeaveRequestsService],
  exports: [TypeOrmModule, LeaveRequestsService],
})
export class LeaveRequestsModule {}
