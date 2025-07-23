import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './modules/users/users.module';
import { JobTitleModule } from './modules/job-title/job-title.module';
import { UserStatusModule } from './modules/user-status/user-status.module';
import { ConfigModule } from '@nestjs/config';
import { SubUnitModule } from './modules/sub-unit/sub-unit.module';
import { EmployeesModule } from './modules/employees/employees.module';
import { RolesModule } from './modules/roles/roles.module';
import { UserRoleModule } from './modules/user-role/user-role.module';
import { AuthModule } from './modules/auth/auth.module';
import { PermissionsModule } from './modules/permissions/permissions.module';
import { RolePermissionModule } from './modules/permissions/role-permission/role-permission.module';
import { UserPermissionModule } from './modules/permissions/user-permission/user-permission.module';


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
    EmployeesModule,
    RolesModule,
    UserRoleModule,
    PermissionsModule,
    RolePermissionModule,
    UserPermissionModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
