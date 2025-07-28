import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { PermissionsService } from '../permissions/permissions.service';
import { randomUUID } from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private permissionService: PermissionsService,
  ) {}

  async validateUser(userName: string, password: string) {
    const user = await this.usersService.findUserByName(userName);
    if (!user) return null;

    const passwordValid = await bcrypt.compare(password, user.password);
    return passwordValid ? user : null;
  }

  async login(user: any) {
    const roles = user.userRole?.map((ur) => ur.role?.name) || [];
    const permissions = await this.permissionService.getPermissionsByUserId(
      user.id,
    );

    const payload = {
      sub: user.id,
      userName: user.userName,
      roles,
      permissions,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
