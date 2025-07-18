import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/modules/users/entities/user.entity';
import { UsersService } from 'src/modules/users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
    ) {}

    async validateUser(userName: string, password: string) : Promise<User | null> {
        const user = await this.usersService.findUserByName(userName)
        if(!user) return null

        const passwordValid = await bcrypt.compare(password, user.password)
        return passwordValid ? user : null
    }

    async login(user: User) {
        const roles = user.userRole?.map((url) => url.role?.name) || []
        const payload = {
            sub: user.id,
            userName: user.userName,
            roles: user.userRole.map(ur => ur.role.name)
        };
        return {
            access_token: this.jwtService.sign(payload)
        }
    }
}
