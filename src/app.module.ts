import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './modules/users/users.module';
import { JobTitleModule } from './modules/employees/job-title/job-title.module';
import { UserStatusModule } from './modules/users/user-status/user-status.module';
import { ConfigModule } from '@nestjs/config';
import { SubUnitModule } from './modules/employees/sub-unit/sub-unit.module';
import { EmployeesModule } from './modules/employees/employees.module';
import { RolesModule } from './modules/roles/roles.module';
import { UserRoleModule } from './modules/user-role/user-role.module';
import { AuthModule } from './modules/auth/auth.module';
import { PermissionsModule } from './modules/permissions/permissions.module';
import { RolePermissionModule } from './modules/permissions/role-permission/role-permission.module';
import { UserPermissionModule } from './modules/permissions/user-permission/user-permission.module';
import { RedisModule } from './redis/redis.module';
import { EmployeeStatusModule } from './modules/employees/employee-status/employee-status.module';
import { LeaveRequestsModule } from './modules/leave-requests/leave-requests.module';
import { LeaveStatusModule } from './modules/leave-requests/leave-status/leave-status.module';
import { LeaveReasonModule } from './modules/leave-requests/leave-reason/leave-reason.module';
import { PartialDayModule } from './modules/leave-requests/partial-day/partial-day.module';
import { LeaveRequestInformModule } from './modules/leave-requests/leave-request-inform/leave-request-inform.module';
import { LeaveRequestTypeModule } from './modules/leave-requests/leave-request-type/leave-request-type.module';


@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({ isGlobal: true }), // Load .env
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: false,
    }),
    UsersModule,
    JobTitleModule,
    UserStatusModule,
    SubUnitModule,
    EmployeeStatusModule,
    EmployeesModule,
    RolesModule,
    UserRoleModule,
    PermissionsModule,
    RolePermissionModule,
    UserPermissionModule,
    RedisModule,
    LeaveRequestsModule,
    LeaveStatusModule,
    LeaveReasonModule,
    PartialDayModule,
    LeaveRequestInformModule,
    LeaveRequestTypeModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
