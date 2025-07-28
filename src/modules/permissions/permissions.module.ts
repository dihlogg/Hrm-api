import { forwardRef, Module } from '@nestjs/common';
import { PermissionsController } from './permissions.controller';
import { RolePermissionModule } from './role-permission/role-permission.module';
import { UserPermissionModule } from './user-permission/user-permission.module';
import { PermissionsService } from './permissions.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission } from './entities/permission.entity';
import { AuthModule } from '../auth/auth.module';
import { UserRole } from '../user-role/entities/user-role.entity';
import { User } from '../users/entities/user.entity';
import { Role } from '../roles/entities/role.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Permission, UserRole, User]),
    UserPermissionModule,
    RolePermissionModule,
    forwardRef(() => AuthModule),
  ],
  controllers: [PermissionsController],
  providers: [PermissionsService],
  exports: [TypeOrmModule, PermissionsService],
})
export class PermissionsModule {}
