import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(private users: UsersService, private jwt: JwtService) {}

  async register(dto: CreateUserDto) {
    const user = await this.users.create(dto);
const token = await this.sign((user as any).id, user.email);
    return { user: this.users.toPublic(user), token };
  }

  async login(dto: LoginDto) {
    const user = await this.users.findByEmail(dto.email, true);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const ok = await bcrypt.compare(dto.password, user.passwordHash);
    if (!ok) throw new UnauthorizedException('Invalid credentials');

    const token = await this.sign(user.id.toString(), user.email);
    return { user: this.users.toPublic(user), token };
  }

  private async sign(sub: string, email: string) {
    return this.jwt.signAsync({ sub, email });
  }
}
