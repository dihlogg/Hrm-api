import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Put,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@ApiTags('Users')
@Controller('Users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  //get all users
  @Get('GetAllUsers')
  async findAll(): Promise<User[]> {
    return await this.usersService.findAll();
  }

  //get user by id
  @Get('GetUserById/:id')
  async findOne(@Param('id') id: string): Promise<User> {
    return this.usersService.findOne(id);
  }

  //create user
  @Post('PostUser')
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return await this.usersService.create(createUserDto);
  }

  //update user
  @Put('PostUser/:id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<boolean> {
    return this.usersService.update(id, updateUserDto);
  }

  //delete user
  @Delete('DeleteUser/:id')
  async delete(@Param('id') id: string): Promise<boolean> {
    return this.usersService.delete(id);
  }
}
