import { Module } from '@nestjs/common';
import { LeaveStatusService } from './leave-status.service';
import { LeaveStatusController } from './leave-status.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LeaveStatus } from './entities/leave-status.entity';


@Module({
  imports: [TypeOrmModule.forFeature([LeaveStatus])],
  controllers: [LeaveStatusController],
  providers: [LeaveStatusService],
  exports: [LeaveStatusService, TypeOrmModule]
})
export class LeaveStatusModule {}
