import { Module } from '@nestjs/common';
import { LeavePolicyService } from './leave-policy.service';
import { LeavePolicyController } from './leave-policy.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LeavePolicy } from './entities/leave-policy.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LeavePolicy])],
  controllers: [LeavePolicyController],
  providers: [LeavePolicyService],
})
export class LeavePolicyModule {}
