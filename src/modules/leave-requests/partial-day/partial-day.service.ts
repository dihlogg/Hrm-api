import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePartialDayDto } from './dto/create-partial-day.dto';
import { UpdatePartialDayDto } from './dto/update-partial-day.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PartialDay } from './entities/partial-day.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PartialDayService {
  constructor(
    @InjectRepository(PartialDay)
    private readonly repo: Repository<PartialDay>,
  ) {}

  async create(createPartialDayDto: CreatePartialDayDto): Promise<PartialDay> {
    const partialDay = this.repo.create(createPartialDayDto);
    return await this.repo.save(partialDay);
  }

  async findAll(): Promise<PartialDay[]> {
    return await this.repo.find({
      order: {
        displayOrder: 'ASC',
      },
    });
  }

  async findOne(id: string): Promise<PartialDay> {
    const partialDay = await this.repo.findOne({ where: { id } });
    if (!partialDay) {
      throw new NotFoundException('Partial day not found');
    }
    return partialDay;
  }

  async update(
    id: string,
    updatePartialDayDto: UpdatePartialDayDto,
  ): Promise<boolean> {
    const updatedPartialDay = await this.repo.update(id, updatePartialDayDto);
    if (updatedPartialDay.affected === 0) {
      throw new NotFoundException('Partial day not found');
    }
    return true;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Partial day not found');
    }
    return true;
  }
}
