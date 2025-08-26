import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class CreateLeaveRequestTypeDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  unit: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @ApiProperty()
  maximumAllowed: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @ApiProperty()
  maxCarryOver: number;

  @ApiProperty()
  expireMonth: number;
}
