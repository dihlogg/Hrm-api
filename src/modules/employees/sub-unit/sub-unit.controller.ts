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
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SubUnitService } from './sub-unit.service';
import { SubUnit } from './entities/sub-unit.entity';
import { CreateSubUnitDto } from './dto/create-sub-unit.dto';
import { UpdateSubUnitDto } from './dto/update-sub-unit.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('SubUnits')
@Controller('SubUnits')
export class SubUnitController {
  constructor(private readonly subUnitService: SubUnitService) {}

  //get all sub unit
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('sub-unit:read')
  @Get('GetAllSubUnits')
  async findAll(): Promise<SubUnit[]> {
    return await this.subUnitService.findAll();
  }

  //get sub unit by id
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('sub-unit:read')
  @Get('GetSubUnitById/:id')
  async findOne(@Param('id') id: string): Promise<SubUnit> {
    return this.subUnitService.findOne(id);
  }

  //create new sub unit
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('sub-unit:create')
  @Post('PostSubUnit')
  async create(@Body() createSubUnitDto: CreateSubUnitDto): Promise<SubUnit> {
    return await this.subUnitService.create(createSubUnitDto);
  }

  //update sub unit
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('sub-unit:update')
  @Put('PutSubUnit/:id')
  async update(
    @Param('id') id: string,
    @Body() updateSubUnitDto: UpdateSubUnitDto,
  ): Promise<boolean> {
    return this.subUnitService.update(id, updateSubUnitDto);
  }

  //delete sub unit
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('sub-unit:delete')
  @Delete('DeleteSubUnit/:id')
  async delete(@Param('id') id: string): Promise<boolean> {
    return this.subUnitService.delete(id);
  }

  //sort sub units by name
  @Get('SortSubUnitsByName')
  async sortByName(
    @Query('sortOrder') sortOrder: 'ASC' | 'DESC' = 'ASC',
  ): Promise<SubUnit[]> {
    return this.subUnitService.sortByName(sortOrder);
  }
}
