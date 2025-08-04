import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional } from 'class-validator';
import { PaginationDto } from 'src/common/utils/pagination/pagination.dto';

export class GetEmployeeListDto extends PaginationDto {
  @ApiPropertyOptional({
    enum: ['firstName', 'lastName', 'employmentType', 'jobTitle', 'subUnit'],
  })
  @IsOptional()
  @IsIn(['firstName', 'lastName', 'employmentType', 'jobTitle', 'subUnit'])
  sortBy?: string;

  @ApiPropertyOptional({ enum: ['ASC', 'DESC'] })
  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  sortOrder?: 'ASC' | 'DESC';

  @IsOptional() firstName?: string;
  @IsOptional() lastName?: string;
  @IsOptional() employmentType?: string;
  @IsOptional() jobTitleId?: string;
  @IsOptional() subUnitId?: string;
}
