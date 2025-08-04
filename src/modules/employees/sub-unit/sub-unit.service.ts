import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SubUnit } from './entities/sub-unit.entity';
import { CreateSubUnitDto } from './dto/create-sub-unit.dto';
import { UpdateSubUnitDto } from './dto/update-sub-unit.dto';
@Injectable()
export class SubUnitService {
  constructor(
    @InjectRepository(SubUnit)
    private readonly repo: Repository<SubUnit>,
  ) {}
  
  async create(createSubUnitDto: CreateSubUnitDto): Promise<SubUnit> {
    const subUnit = this.repo.create(createSubUnitDto);
    return await this.repo.save(subUnit);
  }

  async findAll(): Promise<SubUnit[]> {
    return await this.repo.find({
      order: {
        displayOrder: 'ASC'
      }
    });
  }

  async findOne(id: string): Promise<SubUnit> {
    const subUnit = await this.repo.findOne({ where: { id } });
    if (!subUnit) {
      throw new NotFoundException('Sub Unit not found');
    }
    return subUnit;
  }

  async update(
    id: string,
    updateSubUnitDto: UpdateSubUnitDto,
  ): Promise<boolean> {
    await this.repo.update(id, updateSubUnitDto);
    const updateSubUnit = await this.repo.findOne({ where: { id } });
    if (!updateSubUnit) {
      throw new NotFoundException('Sub Unit not found');
    }
    return true;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Sub Unit not found');
    }
    return true;
  }

  async sortByName(order: 'ASC' | 'DESC' = 'ASC'): Promise<SubUnit[]> {
    return this.repo.find({
      order: {
        name: order
      }
    })
  }
}
