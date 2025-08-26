import { Module } from '@nestjs/common';
import { PartialDayService } from './partial-day.service';
import { PartialDayController } from './partial-day.controller';
import { PartialDay } from './entities/partial-day.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/modules/auth/auth.module';
import { PermissionsModule } from 'src/modules/permissions/permissions.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PartialDay]),
    AuthModule,
    PermissionsModule,
  ],
  controllers: [PartialDayController],
  providers: [PartialDayService],
  exports: [TypeOrmModule, PartialDayService],
})
export class PartialDayModule {}
