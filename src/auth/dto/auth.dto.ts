import { IsEmail, IsString, IsOptional, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterDto {
  @ApiPropertyOptional({ description: 'User name' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ description: 'User email' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'User password' })
  @IsString()
  @MinLength(1)
  password: string;

  @ApiPropertyOptional({ description: 'User role', enum: ['admin', 'candidate', 'interviewer'] })
  @IsOptional()
  @IsString()
  role?: string;
}

export class LoginDto {
  @ApiProperty({ description: 'User email' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'User password' })
  @IsString()
  password: string;
}

export class AuthResponseDto {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  role: string;

  @ApiProperty()
  token: string;
}

export class RefreshTokenResponseDto {
  @ApiProperty()
  token: string;
}

export class LogoutResponseDto {
  @ApiProperty()
  message: string;
}
