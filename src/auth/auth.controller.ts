import { Controller, Post, Body, Get, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './dto/jwt-auth.guard';

@Controller('auth')  // ✅ Base path = /auth
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('register')  // ✅ Full path = POST /auth/register
  register(@Body() dto: CreateUserDto) {
    return this.auth.register(dto);
  }

  @Post('login')     // ✅ Full path = POST /auth/login
  login(@Body() dto: LoginDto) {
    return this.auth.login(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  profile(@Req() req: any) {
    return { userId: req.user.userId, email: req.user.email };
  }
}
