import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { SubUnitService } from './sub-unit.service';
import { CreateSubUnitDto } from './dto/create-sub-unit.dto';
import { UpdateSubUnitDto } from './dto/update-sub-unit.dto';
import { ApiTags } from '@nestjs/swagger';
import { SubUnit } from './entities/sub-unit.entity';

@ApiTags('SubUnits')
@Controller('SubUnits')
export class SubUnitController {
  constructor(private readonly subUnitService: SubUnitService) {}

  //get all sub unit
  @Get('GetAllSubUnits')
  async findAll(): Promise<SubUnit[]> {
    return await this.subUnitService.findAll();
  }

  //get sub unit by id
  @Get('GetSubUnitById/:id')
  async findOne(@Param('id') id: string): Promise<SubUnit> {
    return this.subUnitService.findOne(id);
  }

  //create new sub unit
  @Post('PostSubUnit')
  async create(@Body() createSubUnitDto: CreateSubUnitDto): Promise<SubUnit> {
    return await this.subUnitService.create(createSubUnitDto);
  }

  //update sub unit
  @Put('PutSubUnit/:id')
  async update(
    @Param('id') id: string,
    @Body() updateSubUnitDto: UpdateSubUnitDto,
  ): Promise<boolean> {
    return this.subUnitService.update(id, updateSubUnitDto);
  }

  //delete sub unit
  @Delete('DeleteSubUnit/:id')
  async delete(@Param('id') id: string): Promise<boolean> {
    return this.subUnitService.delete(id);
  }
}
