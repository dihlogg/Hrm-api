import { ApiProperty } from '@nestjs/swagger';

export class CreateUserPermissionDto {
  @ApiProperty()
  userId: string;

  @ApiProperty()
  permissionId: string;

  @ApiProperty()
  isGranted: boolean;
}

export class UserPermissionDto extends CreateUserPermissionDto {
  @ApiProperty()
  id: string;
}
