import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  UseGuards,
} from '@nestjs/common';
import { PartialDayService } from './partial-day.service';
import { CreatePartialDayDto } from './dto/create-partial-day.dto';
import { UpdatePartialDayDto } from './dto/update-partial-day.dto';
import { PartialDay } from './entities/partial-day.entity';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('PartialDays')
export class PartialDayController {
  constructor(private readonly partialDayService: PartialDayService) {}

  //get all partial days
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('partial-day:read')
  @Get('GetAllPartialDays')
  async findAll(): Promise<PartialDay[]> {
    return await this.partialDayService.findAll();
  }

  //get partial day by id
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('partial-day:read')
  @Get('GetPartialDayById/:id')
  async findOne(@Param('id') id: string): Promise<PartialDay> {
    return await this.partialDayService.findOne(id);
  }

  //create new partial day
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('partial-day:create')
  @Post('PostPartialDay')
  async create(
    @Body() createPartialDayDto: CreatePartialDayDto,
  ): Promise<PartialDay> {
    return await this.partialDayService.create(createPartialDayDto);
  }

  //update partial Day
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('partial-day:update')
  @Put('PutPartialDay/:id')
  async update(
    @Param('id') id: string,
    @Body() updatePartialDayDto: UpdatePartialDayDto,
  ): Promise<boolean> {
    return await this.partialDayService.update(id, updatePartialDayDto);
  }

  //delete partial Day
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('partial-day:delete')
  @Delete('DeletePartialDay/:id')
  async delete(@Param('id') id: string): Promise<boolean> {
    return await this.partialDayService.delete(id);
  }
}
