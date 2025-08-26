import { Module } from '@nestjs/common';
import { LeaveReasonService } from './leave-reason.service';
import { LeaveReasonController } from './leave-reason.controller';
import { LeaveReason } from './entities/leave-reason.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/modules/auth/auth.module';
import { PermissionsModule } from 'src/modules/permissions/permissions.module';

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
