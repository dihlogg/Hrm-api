import { Module } from '@nestjs/common';
import { JobTitleService } from './job-title.service';
import { JobTitleController } from './job-title.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobTitle } from './entities/job-title.entity';

@Module({
  imports: [TypeOrmModule.forFeature([JobTitle])],
  controllers: [JobTitleController],
  providers: [JobTitleService],
  exports: [TypeOrmModule],
})
export class JobTitleModule {}
