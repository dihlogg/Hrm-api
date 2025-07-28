import { Module } from '@nestjs/common';
import { SubUnitController } from './sub-unit.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubUnit } from './entities/sub-unit.entity';
import { SubUnitService } from './sub-unit.service';
import { AuthModule } from 'src/modules/auth/auth.module';
import { PermissionsModule } from 'src/modules/permissions/permissions.module';

@Module({
  imports: [TypeOrmModule.forFeature([SubUnit]), AuthModule, PermissionsModule],
  controllers: [SubUnitController],
  providers: [SubUnitService],
  exports: [TypeOrmModule, SubUnitService],
})
export class SubUnitModule {}
