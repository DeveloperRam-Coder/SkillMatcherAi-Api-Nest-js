import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { User, UserDocument } from '../users/schemas/user.schema';
import { RegisterDto, LoginDto, AuthResponseDto, RefreshTokenResponseDto, LogoutResponseDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto, res: Response): Promise<AuthResponseDto> {
    const { name, email, password, role } = registerDto;

    const existingUser = await this.userModel.findOne({ email }).select('+password');
    if (existingUser) {
      const samePassword = await (existingUser as any).matchPassword(password);
      if (samePassword) {
        const accessToken = this.generateToken(existingUser._id.toString());
        const refreshToken = this.generateRefreshToken(existingUser._id.toString());
        existingUser.refreshToken = refreshToken;
        await existingUser.save();
        this.setRefreshTokenCookie(res, refreshToken);
        return {
          _id: existingUser._id.toString(),
          name: existingUser.name,
          email: existingUser.email,
          role: existingUser.role,
          token: accessToken,
        };
      }
      throw new ConflictException('User already exists');
    }

    const user = await this.userModel.create({
      name: name && name.trim() ? name : (email?.split('@')[0] || 'User'),
      email,
      password,
      role: role || 'candidate',
    });

    if (user) {
      const accessToken = this.generateToken(user._id.toString());
      const refreshToken = this.generateRefreshToken(user._id.toString());
      user.refreshToken = refreshToken;
      await user.save();
      this.setRefreshTokenCookie(res, refreshToken);
      return {
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        token: accessToken,
      };
    }
    throw new BadRequestException('Invalid user data');
  }

  async login(loginDto: LoginDto, res: Response): Promise<AuthResponseDto> {
    const { email, password } = loginDto;
    const user = await this.userModel.findOne({ email }).select('+password');
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }
    const isMatch = await (user as any).matchPassword(password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid email or password');
    }
    const accessToken = this.generateToken(user._id.toString());
    const refreshToken = this.generateRefreshToken(user._id.toString());
    user.refreshToken = refreshToken;
    await user.save();
    this.setRefreshTokenCookie(res, refreshToken);
    return {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      token: accessToken,
    };
  }

  async getCurrentUser(userId: string): Promise<Omit<AuthResponseDto, 'token'>> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    };
  }

  async refreshToken(refreshToken: string, res: Response): Promise<RefreshTokenResponseDto> {
    if (!refreshToken) {
      throw new UnauthorizedException('No refresh token');
    }
    try {
      const decoded = this.jwtService.verify(refreshToken, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      });
      const user = await this.userModel.findById((decoded as any).id).select('+refreshToken');
      if (!user || user.refreshToken !== refreshToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }
      const newAccessToken = this.generateToken(user._id.toString());
      const newRefreshToken = this.generateRefreshToken(user._id.toString());
      user.refreshToken = newRefreshToken;
      await user.save();
      this.setRefreshTokenCookie(res, newRefreshToken);
      return { token: newAccessToken };
    } catch (err) {
      throw new UnauthorizedException('Could not refresh token');
    }
  }

  async logout(refreshToken: string, res: Response): Promise<LogoutResponseDto> {
    if (refreshToken) {
      try {
        const decoded = this.jwtService.decode(refreshToken) as any;
        if (decoded?.id) {
          const user = await this.userModel.findById(decoded.id).select('+refreshToken');
          if (user) {
            user.refreshToken = undefined;
            await user.save();
          }
        }
      } catch (e) {}
    }
    this.clearRefreshTokenCookie(res);
    return { message: 'Logged out' };
  }

  private generateToken(userId: string): string {
    return this.jwtService.sign(
      { id: userId },
      {
        secret: this.configService.get('JWT_SECRET'),
        expiresIn: this.configService.get('JWT_EXPIRE'),
      }
    );
  }

  private generateRefreshToken(userId: string): string {
    return this.jwtService.sign(
      { id: userId },
      {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
        expiresIn: '7d',
      }
    );
  }

  private setRefreshTokenCookie(res: Response, token: string): void {
    res.cookie('refreshToken', token, {
      httpOnly: true,
      secure: this.configService.get('NODE_ENV') === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
  }

  private clearRefreshTokenCookie(res: Response): void {
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: this.configService.get('NODE_ENV') === 'production',
      sameSite: 'strict',
    });
  }
}


