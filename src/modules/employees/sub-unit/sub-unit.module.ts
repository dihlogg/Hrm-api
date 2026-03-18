import { Module } from '@nestjs/common';
import { SubUnitController } from './sub-unit.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubUnit } from './entities/sub-unit.entity';
import { SubUnitService } from './sub-unit.service';

@Module({
  imports: [TypeOrmModule.forFeature([SubUnit])],
  controllers: [SubUnitController],
  providers: [SubUnitService],
  exports: [TypeOrmModule, SubUnitService],
})
export class SubUnitModule {}
