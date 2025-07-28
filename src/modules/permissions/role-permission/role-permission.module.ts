import { forwardRef, Module } from '@nestjs/common';
import { RolePermissionService } from './role-permission.service';
import { RolePermissionController } from './role-permission.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolePermission } from './entities/role-permission.entity';
import { AuthModule } from 'src/modules/auth/auth.module';
import { PermissionsModule } from '../permissions.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([RolePermission]),
    forwardRef(() => PermissionsModule),
    forwardRef(() => AuthModule),
  ],
  controllers: [RolePermissionController],
  providers: [RolePermissionService],
  exports: [TypeOrmModule, RolePermissionService],
})
export class RolePermissionModule {}
