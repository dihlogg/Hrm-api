import { Module } from '@nestjs/common';
import { LeaveRequestInformService } from './leave-request-inform.service';
import { LeaveRequestInformController } from './leave-request-inform.controller';
import { LeaveRequestInform } from './entities/leave-request-inform.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([LeaveRequestInform])],
  controllers: [LeaveRequestInformController],
  providers: [LeaveRequestInformService],
})
export class LeaveRequestInformModule {}
