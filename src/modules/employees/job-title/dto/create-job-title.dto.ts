import { ApiProperty } from '@nestjs/swagger';

export class CreateJobTitleDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;
}
