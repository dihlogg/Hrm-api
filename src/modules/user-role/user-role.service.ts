import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserRoleDto } from './dto/create-user-role.dto';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRole } from './entities/user-role.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserRoleService {
  constructor(
    @InjectRepository(UserRole) private readonly repo: Repository<UserRole>,
  ) {}

  async assignRoleToUser(createUserRoleDto: CreateUserRoleDto): Promise<UserRole> {
    const userRole = this.repo.create(createUserRoleDto);
    return await this.repo.save(userRole);
  }

  async revokeRoleFromUser(id: string, updateUserRoleDto: UpdateUserRoleDto) : Promise<boolean> {
    await this.repo.update(id, updateUserRoleDto)
    const userRole = this.repo.findOne({where:{id}})
    if(!userRole) {
      throw new NotFoundException('Not found any role from this user')
    }
    return true
  }
}
