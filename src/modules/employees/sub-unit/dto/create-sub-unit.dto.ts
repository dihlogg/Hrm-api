import { ApiProperty } from '@nestjs/swagger';

export class CreateSubUnitDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  displayOrder: number;
}
