import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role) private readonly repo: Repository<Role>,
  ) {}

  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    const role = this.repo.create(createRoleDto);
    return await this.repo.save(createRoleDto);
  }

  async findAll(): Promise<Role[]> {
    return await this.repo.find();
  }

  async findOne(id: string): Promise<Role> {
    const role = await this.repo.findOne({ where: { id } });
    if (!role) {
      throw new NotFoundException('Role not found');
    }
    return role;
  }

  async update(id: string, updateRoleDto: UpdateRoleDto): Promise<boolean> {
    await this.repo.update(id, updateRoleDto);
    const role = await this.repo.findOne({ where: { id } });
    if (!role) {
      throw new NotFoundException('Role not found');
    }
    return true;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Role not found');
    }
    return true;
  }
}
