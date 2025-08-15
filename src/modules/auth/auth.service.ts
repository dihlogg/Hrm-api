import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { PermissionsService } from '../permissions/permissions.service';
import { randomUUID } from 'crypto';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private permissionService: PermissionsService,
    private configService: ConfigService,
    @Inject('REDIS_CLIENT') private redisClient: Redis,
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
    const jti = randomUUID();

    const payload = {
      sub: user.id,
      userName: user.userName,
      roles,
      permissions,
      jti,
    };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: this.configService.get<string>('JWT_EXPIRES_IN'),
    });

    const refreshToken = randomUUID();
    const refreshTtl =
      this.configService.get<number>('JWT_REFRESH_TTL') || 1 * 24 * 60 * 60; // seconds
    await this.redisClient.set(
      `refresh_token:${refreshToken}`,
      user.id.toString(),
      'EX',
      refreshTtl,
    );

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_in: this.configService.get<string>('JWT_EXPIRES_IN'),
    };
  }

  async refreshToken(token: string) {
    try {
      const userId = await this.redisClient.get(`refresh_token:${token}`);
      if (!userId)
        throw new UnauthorizedException('Invalid or expired refresh token');

      await this.redisClient.del(`refresh_token:${token}`);

      const user = await this.usersService.findOne(userId);
      if (!user) throw new UnauthorizedException('User not found');

      const roles = user.userRole?.map((ur) => ur.role?.name) || [];
      const permissions = await this.permissionService.getPermissionsByUserId(
        user.id,
      );
      const newJti = randomUUID();

      const newAccessToken = this.jwtService.sign(
        {
          sub: user.id,
          userName: user.userName,
          roles,
          permissions,
          jti: newJti,
        },
        {
          expiresIn: this.configService.get<string>('JWT_EXPIRES_IN'),
        },
      );

      const newRefreshToken = randomUUID();
      const refreshTtl =
        this.configService.get<number>('JWT_REFRESH_TTL') || 1 * 24 * 60 * 60;
      await this.redisClient.set(
        `refresh_token:${newRefreshToken}`,
        user.id.toString(),
        'EX',
        refreshTtl,
      );

      return {
        access_token: newAccessToken,
        refresh_token: newRefreshToken,
        expires_in: this.configService.get<string>('JWT_EXPIRES_IN'),
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }
}
