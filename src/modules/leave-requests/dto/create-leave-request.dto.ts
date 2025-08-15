import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateLeaveRequestDto {
  @ApiProperty()
  fromDate: Date;

  @ApiProperty()
  toDate: Date;

  @ApiProperty()
  duration: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Employee Id is required' })
  @IsUUID('4', { message: 'Employee Id must be a valid UUID' })
  employeeId: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Approve Id is required' })
  @IsUUID('4', { message: 'Approve Id must be a valid UUID' })
  approverId: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'InformTo Id is required' })
  @IsUUID('4', { message: 'InformTo Id must be a valid UUID' })
  informToId: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Partial Day Id is required' })
  @IsUUID('4', { message: 'Partial Day Id must be a valid UUID' })
  partialDayId: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Leave Request Type Id is required' })
  @IsUUID('4', { message: 'Leave Request Type Id must be a valid UUID' })
  leaveRequestTypeId: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Leave Reason Id is required' })
  @IsUUID('4', { message: 'Leave Reason Id must be a valid UUID' })
  leaveReasonId: string;

  @ApiProperty()
  reasonDetails: string;
}
