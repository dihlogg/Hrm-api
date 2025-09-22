import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional } from 'class-validator';
import { PaginationDto } from 'src/common/utils/pagination/pagination.dto';

export class GetLeaveRequestListDto extends PaginationDto {
  @ApiPropertyOptional({
    enum: ['leaveStatus', 'leaveRequestType', 'employee'],
  })
  @IsOptional()
  @IsIn(['leaveStatus', 'leaveRequestType', 'employee'])
  sortBy?: string;

  @ApiPropertyOptional({ enum: ['ASC', 'DESC'] })
  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  sortOrder?: 'ASC' | 'DESC';

  @IsOptional() fromDate?: string;
  @IsOptional() toDate?: string;
  @IsOptional() leaveStatusId?: string;
  @IsOptional() leaveRequestTypeId?: string;
  @IsOptional() employeeId?: string;
}
