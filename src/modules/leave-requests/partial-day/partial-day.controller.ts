import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { PartialDayService } from './partial-day.service';
import { CreatePartialDayDto } from './dto/create-partial-day.dto';
import { UpdatePartialDayDto } from './dto/update-partial-day.dto';
import { PartialDay } from './entities/partial-day.entity';

@Controller('PartialDays')
export class PartialDayController {
  constructor(private readonly partialDayService: PartialDayService) {}

  //get all partial days
  @Get('GetAllPartialDays')
  async findAll(): Promise<PartialDay[]> {
    return await this.partialDayService.findAll();
  }

  //get partial day by id
  @Get('GetPartialDayById/:id')
  async findOne(@Param('id') id: string): Promise<PartialDay> {
    return await this.partialDayService.findOne(id);
  }

  //create new partial day
  @Post('PostPartialDay')
  async create(
    @Body() createPartialDayDto: CreatePartialDayDto,
  ): Promise<PartialDay> {
    return await this.partialDayService.create(createPartialDayDto);
  }

  //update partial Day
  @Put('PutPartialDay/:id')
  async update(
    @Param('id') id: string,
    @Body() updatePartialDayDto: UpdatePartialDayDto,
  ): Promise<boolean> {
    return await this.partialDayService.update(id, updatePartialDayDto);
  }

  //delete partial Day
  @Delete('DeletePartialDay/:id')
  async delete(@Param('id') id: string): Promise<boolean> {
    return await this.partialDayService.delete(id);
  }
}
