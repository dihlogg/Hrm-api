import { Module } from '@nestjs/common';
import { LeaveRequestInformService } from './leave-request-inform.service';
import { LeaveRequestInformController } from './leave-request-inform.controller';
import { LeaveRequestParticipants } from './entities/leave-request-inform.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/modules/auth/auth.module';
import { PermissionsModule } from 'src/modules/permissions/permissions.module';

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
