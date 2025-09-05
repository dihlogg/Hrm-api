import { Optional } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateLeaveRequestStatusDto {
  @IsString()
  @ApiProperty()
  statusCode: string;

  @IsString()
  @Optional()
  @ApiProperty()
  note?: string;
}
