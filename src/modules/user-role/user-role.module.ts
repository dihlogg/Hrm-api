import { Module } from '@nestjs/common';
import { UserRoleService } from './user-role.service';
import { UserRoleController } from './user-role.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRole } from './entities/user-role.entity';
import { AuthModule } from '../auth/auth.module';
import { PermissionsModule } from '../permissions/permissions.module';

@Module({
  imports: [TypeOrmModule.forFeature([UserRole]), AuthModule, PermissionsModule],
  controllers: [UserRoleController],
  providers: [UserRoleService],
  exports: [TypeOrmModule]
})
export class UserRoleModule {}
