import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { JobTitleModule } from '../job-title/job-title.module';
import { UserStatusModule } from '../user-status/user-status.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JobTitleModule,
    UserStatusModule
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
