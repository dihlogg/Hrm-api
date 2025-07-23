import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('Auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('Login')
  async login(@Body() loginDto: LoginDto) {
    const { userName, password } = loginDto;
    const user = await this.authService.validateUser(userName, password);
    if (!user) {
      throw new UnauthorizedException('Invalid username or password');
    }
    return this.authService.login(user);
  }
}
