import { Module } from '@nestjs/common';
import { LeaveReasonService } from './leave-reason.service';
import { LeaveReasonController } from './leave-reason.controller';
import { LeaveReason } from './entities/leave-reason.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionsModule } from '../../permissions/permissions.module';
import { AuthModule } from '../../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([LeaveReason]),
    AuthModule,
    PermissionsModule,
  ],
  controllers: [LeaveReasonController],
  providers: [LeaveReasonService],
  exports: [TypeOrmModule, LeaveReasonService],
})
export class LeaveReasonModule {}
