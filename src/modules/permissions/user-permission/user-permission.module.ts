import { forwardRef, Module } from '@nestjs/common';
import { UserPermissionService } from './user-permission.service';
import { UserPermissionController } from './user-permission.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserPermission } from './entities/user-permission.entity';
import { AuthModule } from 'src/modules/auth/auth.module';
import { PermissionsModule } from '../permissions.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserPermission]),
    forwardRef(() => AuthModule),
    forwardRef(() => PermissionsModule),
  ],
  controllers: [UserPermissionController],
  providers: [UserPermissionService],
  exports: [TypeOrmModule],
})
export class UserPermissionModule {}
