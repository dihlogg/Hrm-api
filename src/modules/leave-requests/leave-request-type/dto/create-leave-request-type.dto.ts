import { ApiProperty } from '@nestjs/swagger';

export class CreateLeaveRequestTypeDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  maximumAllowed: number;
}
