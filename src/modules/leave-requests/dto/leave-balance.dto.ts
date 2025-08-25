import { ApiProperty } from '@nestjs/swagger';

export class LeaveBalanceDto {
  @ApiProperty()
  leaveRequestTypeId: string;

  @ApiProperty()
  leaveRequestTypeName: string;

  @ApiProperty()
  maximumAllowed: number;

  @ApiProperty()
  approvedQuotas: number;

  @ApiProperty()
  pendingQuotas: number;

  @ApiProperty()
  remainingQuotas: number;
}
