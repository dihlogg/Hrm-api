import { Module } from '@nestjs/common';
import { LeaveReasonService } from './leave-reason.service';
import { LeaveReasonController } from './leave-reason.controller';
import { LeaveReason } from './entities/leave-reason.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([LeaveReason])],
  controllers: [LeaveReasonController],
  providers: [LeaveReasonService],
  exports: [TypeOrmModule, LeaveReasonService]
})
export class LeaveReasonModule {}
