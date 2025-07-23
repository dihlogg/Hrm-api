import { ApiProperty } from '@nestjs/swagger';
export class CreateUserDto {
  @ApiProperty()
  userName: string;

  @ApiProperty()
  password: string;

  @ApiProperty()
  userStatusId: string;
}
