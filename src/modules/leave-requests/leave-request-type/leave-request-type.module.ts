import { Module } from '@nestjs/common';
import { LeaveRequestTypeService } from './leave-request-type.service';
import { LeaveRequestTypeController } from './leave-request-type.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LeaveRequestType } from './entities/leave-request-type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LeaveRequestType])],
  controllers: [LeaveRequestTypeController],
  providers: [LeaveRequestTypeService],
  exports: [TypeOrmModule, LeaveRequestTypeService]
})
export class LeaveRequestTypeModule {}
