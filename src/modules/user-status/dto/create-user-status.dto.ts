import { ApiProperty } from '@nestjs/swagger';

export class CreateUserStatusDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  displayOrder: number;
}
