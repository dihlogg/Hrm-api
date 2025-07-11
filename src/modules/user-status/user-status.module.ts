import { Module } from '@nestjs/common';
import { UserStatusService } from './user-status.service';
import { UserStatusController } from './user-status.controller';
import { UserStatus } from './entities/user-status.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([UserStatus])],
  controllers: [UserStatusController],
  providers: [UserStatusService],
  exports: [TypeOrmModule],
})
export class UserStatusModule {}
