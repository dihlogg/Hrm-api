import { Module } from '@nestjs/common';
import { LeaveRequestInformService } from './leave-request-inform.service';
import { LeaveRequestInformController } from './leave-request-inform.controller';
import { LeaveRequestParticipants } from './entities/leave-request-inform.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionsModule } from '../../permissions/permissions.module';
import { AuthModule } from '../../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([LeaveRequestParticipants]),
    AuthModule,
    PermissionsModule,
  ],
  controllers: [LeaveRequestInformController],
  providers: [LeaveRequestInformService],
  exports: [TypeOrmModule, LeaveRequestInformService],
})
export class LeaveRequestInformModule {}
