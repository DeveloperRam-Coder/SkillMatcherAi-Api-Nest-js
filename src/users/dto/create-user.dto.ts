import { IsEmail, IsNotEmpty, MinLength, IsOptional, IsIn } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsOptional()
  @IsIn(['admin', 'candidate', 'interviewer'])
  role?: string;
}
