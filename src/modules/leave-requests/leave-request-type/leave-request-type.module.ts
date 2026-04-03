import { Module } from '@nestjs/common';
import { LeaveRequestTypeService } from './leave-request-type.service';
import { LeaveRequestTypeController } from './leave-request-type.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LeaveRequestType } from './entities/leave-request-type.entity';
import { AuthModule } from '../../auth/auth.module';
import { PermissionsModule } from '../../permissions/permissions.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([LeaveRequestType]),
    AuthModule,
    PermissionsModule,
  ],
  controllers: [LeaveRequestTypeController],
  providers: [LeaveRequestTypeService],
  exports: [TypeOrmModule, LeaveRequestTypeService],
})
export class LeaveRequestTypeModule {}
