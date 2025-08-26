import { Module } from '@nestjs/common';
import { LeaveStatusService } from './leave-status.service';
import { LeaveStatusController } from './leave-status.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LeaveStatus } from './entities/leave-status.entity';
import { AuthModule } from 'src/modules/auth/auth.module';
import { PermissionsModule } from 'src/modules/permissions/permissions.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([LeaveStatus]),
    AuthModule,
    PermissionsModule,
  ],
  controllers: [LeaveStatusController],
  providers: [LeaveStatusService],
  exports: [LeaveStatusService, TypeOrmModule],
})
export class LeaveStatusModule {}
