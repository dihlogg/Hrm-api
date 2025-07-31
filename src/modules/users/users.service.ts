import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserStatus } from './user-status/entities/user-status.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly repo: Repository<User>,
    @InjectRepository(UserStatus)
    private userStatusRepo: Repository<UserStatus>,
  ) {}

  async create(
    createUserDto: CreateUserDto,
    manager?: EntityManager,
  ): Promise<User> {
    const repo = manager ? manager.getRepository(User) : this.repo;
    const userStatusRepo = manager
      ? manager.getRepository(UserStatus)
      : this.userStatusRepo;

    if (!createUserDto.userStatusId) {
      throw new Error('Create user failed: userStatusId is required');
    }

    const existingUser = await repo.findOne({
      where: { userName: createUserDto.userName },
    });
    if (existingUser) {
      throw new Error(`Username '${createUserDto.userName}' is already taken.`);
    }

    const userStatus = await userStatusRepo.findOneBy({
      id: createUserDto.userStatusId,
    });

    if (!userStatus) {
      throw new Error('Create user failed: UserStatus not found');
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

    const user = repo.create({
      userName: createUserDto.userName,
      password: hashedPassword,
      userStatus: userStatus,
    });

    return await repo.save(user);
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

  async findUserByName(userName: string): Promise<User> {
    const user = await this.repo.findOne({
      where: { userName },
      relations: ['userRole', 'userRole.role'],
    });
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
