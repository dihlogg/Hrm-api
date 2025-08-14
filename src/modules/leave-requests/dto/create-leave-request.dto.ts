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
  @IsNotEmpty({ message: 'Employee ID is required' })
  @IsUUID('4', { message: 'Employee ID must be a valid UUID' })
  employeeId: string;
  
  @ApiProperty()
  @IsNotEmpty({ message: 'Partial Day ID is required' })
  @IsUUID('4', { message: 'Partial Day ID must be a valid UUID' })
  partialDayId: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Leave Status ID is required' })
  @IsUUID('4', { message: 'Leave Status ID must be a valid UUID' })
  leaveStatusId: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Leave Reason ID is required' })
  @IsUUID('4', { message: 'Leave Reason ID must be a valid UUID' })
  leaveReasonId: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Leave Request Type ID is required' })
  @IsUUID('4', { message: 'Leave Request Type ID must be a valid UUID' })
  leaveRequestTypeId: string;

  @ApiProperty()
  reasonDetails: string;
}
