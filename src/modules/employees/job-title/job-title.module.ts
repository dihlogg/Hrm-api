import { forwardRef, Module } from '@nestjs/common';
import { JobTitleService } from './job-title.service';
import { JobTitleController } from './job-title.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobTitle } from './entities/job-title.entity';
import { AuthModule } from '../../auth/auth.module';
import { PermissionsModule } from '../../permissions/permissions.module';

@Module({
  imports: [
  TypeOrmModule.forFeature([JobTitle]),
  AuthModule,
  PermissionsModule
],
  controllers: [JobTitleController],
  providers: [JobTitleService],
  exports: [TypeOrmModule, JobTitleService],
})
export class JobTitleModule {}
