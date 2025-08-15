import { ApiProperty } from '@nestjs/swagger';

export class CreateLeaveRequestParticipantsDto {
  @ApiProperty()
  leaveRequestId: string;

  @ApiProperty()
  employeeId: string;

  @ApiProperty()
  type: string;
}

export class CreateLeaveRequestWithManyParticipantsDto {
  @ApiProperty()
  leaveRequestId: string;

  @ApiProperty()
  approverId: string;

  @ApiProperty()
  informToId: string;
}
