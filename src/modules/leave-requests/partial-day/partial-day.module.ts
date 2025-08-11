import { Module } from '@nestjs/common';
import { PartialDayService } from './partial-day.service';
import { PartialDayController } from './partial-day.controller';
import { PartialDay } from './entities/partial-day.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([PartialDay])],
  controllers: [PartialDayController],
  providers: [PartialDayService],
  exports: [TypeOrmModule, PartialDayService]
})
export class PartialDayModule {}
