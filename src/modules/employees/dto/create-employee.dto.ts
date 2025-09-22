import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateUserDto } from 'src/modules/users/dto/create-user.dto';

export class CreateEmployeeDto {
  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  phoneNumber: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  address: string;

  @ApiProperty()
  gender: string;

  @ApiProperty()
  dayOfBirth: Date;

  @ApiProperty()
  nationality: string;

  @ApiProperty()
  imageUrl: string;

  @ApiProperty()
  employeeStatusId: string; // 'official' | 'temporary'

  @ApiProperty()
  jobTitleId: string;

  @ApiProperty()
  subUnitId: string;

  @ApiProperty()
  parentId: string;

  @ApiPropertyOptional({ default: false })
  createLogin?: boolean;

  @ApiPropertyOptional({ type: () => CreateUserDto })
  user?: CreateUserDto;
}
