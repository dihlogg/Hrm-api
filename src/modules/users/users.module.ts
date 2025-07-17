import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { JobTitleModule } from '../job-title/job-title.module';
import { UserStatusModule } from '../user-status/user-status.module';
import { SubUnitModule } from '../sub-unit/sub-unit.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JobTitleModule,
    UserStatusModule,
    SubUnitModule
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [TypeOrmModule],
})
export class UsersModule {}
