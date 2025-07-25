import { ApiProperty } from '@nestjs/swagger';

export class CreateRoleDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  displayOrder: number;
}
export class RoleDto extends CreateRoleDto {
  @ApiProperty()
  id: string;
}
