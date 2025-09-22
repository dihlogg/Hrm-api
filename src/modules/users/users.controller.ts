import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Put,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { GetUserListDto } from './dto/get-user-list.dto';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Users')
@Controller('Users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  //get all users
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('user:read')
  @Get('GetAllUsers')
  async findAll(): Promise<User[]> {
    return await this.usersService.findAll();
  }

  //get user by id
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('user:read')
  @Get('GetUserById/:id')
  async findOne(@Param('id') id: string): Promise<User> {
    return this.usersService.findOne(id);
  }

  //get user by user name
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('user:read')
  @Get('GetUserByName/:userName')
  async findUserByName(@Param('userName') userName: string): Promise<User> {
    return this.usersService.findUserByName(userName);
  }

  //create user
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('user:create')
  @Post('PostUser')
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return await this.usersService.create(createUserDto);
  }

  //update user
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('user:update')
  @Put('PutUser/:id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<boolean> {
    return this.usersService.update(id, updateUserDto);
  }

  //delete user
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('user:delete')
  @Delete('DeleteUser/:id')
  async delete(@Param('id') id: string): Promise<boolean> {
    return this.usersService.delete(id);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('user:read')
  @Get('GetUserInfor')
  getMe(@Req() req) {
    return {
      userId: req.user.userId,
      username: req.user.userName,
      roles: req.user.roles,
    };
  }

  //sorted and paginated user list
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('user:read')
  @Get('GetUserList')
  async getUserList(@Query() query: GetUserListDto) {
    return this.usersService.getUserList(query);
  }
}
