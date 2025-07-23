import { ApiProperty } from '@nestjs/swagger';

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
  employmentType: string; // 'official' | 'temporary'

  @ApiProperty()
  jobTitleId: string;

  @ApiProperty()
  subUnitId: string;

  @ApiProperty()
  userId: string;
}
