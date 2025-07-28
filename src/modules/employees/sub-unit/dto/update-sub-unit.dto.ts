import { PartialType } from '@nestjs/mapped-types';
import { CreateSubUnitDto } from './create-sub-unit.dto';

export class UpdateSubUnitDto extends PartialType(CreateSubUnitDto) {}
