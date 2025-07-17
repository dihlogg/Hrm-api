import { Module } from '@nestjs/common';
import { SubUnitService } from './sub-unit.service';
import { SubUnitController } from './sub-unit.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubUnit } from './entities/sub-unit.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SubUnit])],
  controllers: [SubUnitController],
  providers: [SubUnitService],
  exports: [TypeOrmModule],
})
export class SubUnitModule {}
