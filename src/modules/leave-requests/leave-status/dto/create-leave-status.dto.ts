import { ApiProperty } from "@nestjs/swagger";

export class CreateLeaveStatusDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  displayOrder: number;
}
