import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional } from 'class-validator';
import { PaginationDto } from 'src/common/utils/pagination/pagination.dto';

export class GetUserListDto extends PaginationDto {
  @ApiPropertyOptional({
    enum: ['userName', 'firstName', 'lastName', 'employeeName', 'userStatusId', 'roleId'],
  })
  @IsOptional()
  @IsIn(['userName', 'firstName', 'lastName', 'employeeName', 'userStatusId', 'roleId'])
  sortBy?: string;

  @ApiPropertyOptional({ enum: ['ASC', 'DESC'] })
  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  sortOrder?: 'ASC' | 'DESC';

  @IsOptional() userName?: string;
  @IsOptional() firstName?: string;
  @IsOptional() lastName?: string;
  @IsOptional() employeeName?: string;
  @IsOptional() userStatusId?: string;
  @IsOptional() roleId?: string;
}
