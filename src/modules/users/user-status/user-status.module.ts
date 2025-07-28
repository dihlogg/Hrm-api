import { Module } from '@nestjs/common';
import { UserStatusController } from './user-status.controller';
import { UserStatus } from './entities/user-status.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserStatusService } from './user-status.service';
import { AuthModule } from 'src/modules/auth/auth.module';
import { PermissionsModule } from 'src/modules/permissions/permissions.module';

@Module({
  imports: [TypeOrmModule.forFeature([UserStatus]), AuthModule, PermissionsModule],
  controllers: [UserStatusController],
  providers: [UserStatusService],
  exports: [TypeOrmModule, UserStatusService],
})
export class UserStatusModule {}
