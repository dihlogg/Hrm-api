import { ApiProperty } from '@nestjs/swagger';

export class CreateEmployeeStatusDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  displayOrder: number;

  @ApiProperty()
  statusCode: string;
}
