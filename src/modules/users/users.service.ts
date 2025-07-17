import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserStatus } from '../user-status/entities/user-status.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly repo: Repository<User>,
    @InjectRepository(UserStatus)
    private userStatusRepo: Repository<UserStatus>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const userStatuses = await this.userStatusRepo.findOneBy({
      id: createUserDto.userStatusId,
    });

    if (!userStatuses) {
      throw new Error('Job title not found');
    }
    const user = this.repo.create({
      userName: createUserDto.userName,
      password: createUserDto.password,
      userStatus: userStatuses,
    });

    return await this.repo.save(user);
  }

  async findAll(): Promise<User[]> {
    return await this.repo.find();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.repo.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<boolean> {
    await this.repo.update(id, updateUserDto);
    const updatedUser = await this.repo.findOne({ where: { id } });
    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }
    return true;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('User not found');
    }
    return true;
  }
}
