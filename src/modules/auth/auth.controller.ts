import { Body, Controller, Get, Post, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { EmployeesService } from '../employees/employees.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

@Controller('Auth')
export class AuthController {
  constructor(private authService: AuthService, private employeesService: EmployeesService) {}

  @Post('Login')
  async login(@Body() loginDto: LoginDto) {
    const { userName, password } = loginDto;
    const user = await this.authService.validateUser(userName, password);
    if (!user) {
      throw new UnauthorizedException('Invalid username or password');
    }
    return this.authService.login(user);
  }
  
  @Post('RefreshToken')
  async refresh(@Body() body: RefreshTokenDto) {
    return this.authService.refreshToken(body.refreshToken);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('VerifyToken')
  async verifyToken(@Req() req) {
    const userId = req.user.userId; 
    
    const employee = await this.employeesService.getEmployeeDetailsByUserId(userId);

    return {
      userId: userId,
      employeeId: employee.id,
      fullName: `${employee.lastName} ${employee.firstName}`.trim(),
      roles: req.user.roles,
    };
  }
}
