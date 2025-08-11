import { ApiProperty } from '@nestjs/swagger';

export class CreateLeaveReasonDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  displayOrder: number;
}
