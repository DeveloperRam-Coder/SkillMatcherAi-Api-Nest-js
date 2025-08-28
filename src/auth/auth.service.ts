import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(private users: UsersService, private jwt: JwtService) {}

  async register(dto: CreateUserDto) {
    const { name, email, password, role } = dto;

    // Check if user already exists
    const existingUser = await this.users.findByEmail(email, true);

    if (existingUser) {
      // If password matches, treat as login for simplicity
      const samePassword = await bcrypt.compare(password, existingUser.password);
      if (samePassword) {
        const accessToken = await this.sign(existingUser._id.toString(), existingUser.email);
        const refreshToken = await this.generateRefreshToken(existingUser._id.toString());
        
        // Update refresh token
        await this.users.updateRefreshToken(existingUser._id.toString(), refreshToken);

        return {
          _id: existingUser._id,
          name: existingUser.name,
          email: existingUser.email,
          role: existingUser.role,
          token: accessToken,
        };
      }

      throw new ConflictException('User already exists');
    }

    // Create new user with default role if not provided
    const userData = {
      name: name && name.trim() ? name : (email?.split('@')[0] || 'User'),
      email,
      password,
      role: role || 'candidate',
    };

    const user = await this.users.create(userData);
    const accessToken = await this.sign(user._id.toString(), user.email);
    const refreshToken = await this.generateRefreshToken(user._id.toString());
    
    // Update refresh token
    await this.users.updateRefreshToken(user._id.toString(), refreshToken);

    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: accessToken,
    };
  }

  async login(dto: LoginDto) {
    const { email, password } = dto;

    // Check for user email
    const user = await this.users.findByEmail(email, true);

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Check if password matches
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const accessToken = await this.sign(user._id.toString(), user.email);
    const refreshToken = await this.generateRefreshToken(user._id.toString());
    
    // Update refresh token
    await this.users.updateRefreshToken(user._id.toString(), refreshToken);

    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: accessToken,
    };
  }

  async getCurrentUser(userId: string) {
    const user = await this.users.findById(userId);

    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
  }

  async refreshToken(refreshToken: string) {
    try {
      const decoded = await this.jwt.verifyAsync(refreshToken);
      const user = await this.users.findById(decoded.sub);
      
      if (!user) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const newAccessToken = await this.sign(user._id.toString(), user.email);
      const newRefreshToken = await this.generateRefreshToken(user._id.toString());
      
      // Update refresh token
      await this.users.updateRefreshToken(user._id.toString(), newRefreshToken);

      return { token: newAccessToken };
    } catch (err) {
      throw new UnauthorizedException('Could not refresh token');
    }
  }

  async logout(userId: string) {
    // Invalidate refresh token by setting it to empty string
    await this.users.updateRefreshToken(userId, '');
    return { message: 'Logged out' };
  }

  private async sign(sub: string, email: string) {
    return this.jwt.signAsync({ sub, email });
  }

  private async generateRefreshToken(sub: string) {
    return this.jwt.signAsync({ sub }, { expiresIn: '7d' });
  }
}
