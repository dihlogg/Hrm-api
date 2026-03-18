import { Module } from '@nestjs/common';
import { UserStatusController } from './user-status.controller';
import { UserStatus } from './entities/user-status.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserStatusService } from './user-status.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserStatus])],
  controllers: [UserStatusController],
  providers: [UserStatusService],
  exports: [TypeOrmModule, UserStatusService],
})
export class UserStatusModule {}
