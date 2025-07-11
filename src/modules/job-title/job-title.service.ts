import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateJobTitleDto } from './dto/create-job-title.dto';
import { UpdateJobTitleDto } from './dto/update-job-title.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { JobTitle } from './entities/job-title.entity';
import { Repository } from 'typeorm';

@Injectable()
export class JobTitleService {
  constructor(
    @InjectRepository(JobTitle)
    private readonly repo: Repository<JobTitle>,
  ) {}

  async create(createJobTitleDto: CreateJobTitleDto): Promise<JobTitle> {
    const jobTitle = this.repo.create(createJobTitleDto);
    return await this.repo.save(jobTitle);
  }

  async findAll(): Promise<JobTitle[]> {
    return await this.repo.find();
  }

  async findOne(id: string): Promise<JobTitle> {
    const jobTitle = await this.repo.findOne({ where: { id } });
    if (!jobTitle) {
      throw new NotFoundException('Job title not found');
    }
    return jobTitle;
  }

  async update(
    id: string,
    updateJobTitleDto: UpdateJobTitleDto,
  ): Promise<boolean> {
    await this.repo.update(id, updateJobTitleDto);
    const updatedJobTitle = await this.repo.findOne({ where: { id } });
    if (!updatedJobTitle) {
      throw new NotFoundException('Job title not found');
    }
    return true;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Job title not found');
    }
    return true;
  }
}
