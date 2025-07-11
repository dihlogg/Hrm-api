import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { JobTitleService } from './job-title.service';
import { CreateJobTitleDto } from './dto/create-job-title.dto';
import { UpdateJobTitleDto } from './dto/update-job-title.dto';
import { ApiTags } from '@nestjs/swagger';
import { JobTitle } from './entities/job-title.entity';

@ApiTags('JobTitles')
@Controller('JobTitles')
export class JobTitleController {
  constructor(private readonly jobTitleService: JobTitleService) {}

  //get all job titles
  @Get('GetAllJobTitles')
  async findAll(): Promise<JobTitle[]> {
    return await this.jobTitleService.findAll();
  }

  //get job title by id
  @Get('GetJobTitleById/:id')
  async findOne(@Param('id') id: string): Promise<JobTitle> {
    return this.jobTitleService.findOne(id);
  }

  //create job title
  @Post('PostJobTitle')
  async create(
    @Body() createJobTitleDto: CreateJobTitleDto,
  ): Promise<JobTitle> {
    return await this.jobTitleService.create(createJobTitleDto);
  }

  //update job title
  @Put('PutJobTitle/:id')
  async update(
    @Param('id') id: string,
    @Body() updateJobTitleDto: UpdateJobTitleDto,
  ): Promise<boolean> {
    return this.jobTitleService.update(id, updateJobTitleDto);
  }

  //delete job title
  @Delete('DeleteJobTitle/:id')
  async delete(@Param('id') id: string): Promise<boolean> {
    return this.jobTitleService.delete(id);
  }
}
