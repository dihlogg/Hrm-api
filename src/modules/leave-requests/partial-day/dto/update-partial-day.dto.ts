import { PartialType } from '@nestjs/mapped-types';
import { CreatePartialDayDto } from './create-partial-day.dto';

export class UpdatePartialDayDto extends PartialType(CreatePartialDayDto) {}
