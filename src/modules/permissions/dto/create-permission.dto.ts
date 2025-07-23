import { ApiProperty } from '@nestjs/swagger';

export class CreatePermissionDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  displayOrder: number;

  @ApiProperty()
  code: string;
}
