import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
  Query,
} from '@nestjs/common';
import { JobTitleService } from './job-title.service';
import { CreateJobTitleDto } from './dto/create-job-title.dto';
import { UpdateJobTitleDto } from './dto/update-job-title.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JobTitle } from './entities/job-title.entity';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('JobTitles')
@Controller('JobTitles')
export class JobTitleController {
  constructor(private readonly jobTitleService: JobTitleService) {}

  //get all job titles
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('job-title:read')
  @Get('GetAllJobTitles')
  async findAll(): Promise<JobTitle[]> {
    return await this.jobTitleService.findAll();
  }

  //get job title by id
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('job-title:read')
  @Get('GetJobTitleById/:id')
  async findOne(@Param('id') id: string): Promise<JobTitle> {
    return this.jobTitleService.findOne(id);
  }

  //create job title
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('job-title:create')
  @Post('PostJobTitle')
  async create(
    @Body() createJobTitleDto: CreateJobTitleDto,
  ): Promise<JobTitle> {
    return await this.jobTitleService.create(createJobTitleDto);
  }

  //update job title
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('job-title:update')
  @Put('PutJobTitle/:id')
  async update(
    @Param('id') id: string,
    @Body() updateJobTitleDto: UpdateJobTitleDto,
  ): Promise<boolean> {
    return this.jobTitleService.update(id, updateJobTitleDto);
  }

  //delete job title
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('job-title:delete')
  @Delete('DeleteJobTitle/:id')
  async delete(@Param('id') id: string): Promise<boolean> {
    return this.jobTitleService.delete(id);
  }

  //sort job titles by name
  @Get('SortJobTitlesByName')
  async sortByName(
    @Query('sortOrder') sortOrder: 'ASC' | 'DESC' = 'ASC'
  ): Promise<JobTitle[]> {
    return this.jobTitleService.sortByName(sortOrder);
  }
}
