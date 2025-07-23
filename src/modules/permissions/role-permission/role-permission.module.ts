import { Module } from '@nestjs/common';
import { RolePermissionService } from './role-permission.service';
import { RolePermissionController } from './role-permission.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolePermission } from './entities/role-permission.entity';

@Module({
  imports: [(TypeOrmModule.forFeature([RolePermission]))],
  controllers: [RolePermissionController],
  providers: [RolePermissionService],
  exports: [TypeOrmModule]
})
export class RolePermissionModule {}
