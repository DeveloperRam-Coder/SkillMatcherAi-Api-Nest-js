import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthService {
    private users;
    private jwt;
    constructor(users: UsersService, jwt: JwtService);
    register(dto: CreateUserDto): Promise<{
        _id: import("mongoose").Types.ObjectId;
        name: string;
        email: string;
        role: string;
        token: string;
    }>;
    login(dto: LoginDto): Promise<{
        _id: import("mongoose").Types.ObjectId;
        name: string;
        email: string;
        role: string;
        token: string;
    }>;
    getCurrentUser(userId: string): Promise<{
        _id: import("mongoose").Types.ObjectId;
        name: string;
        email: string;
        role: string;
    }>;
    refreshToken(refreshToken: string): Promise<{
        token: string;
    }>;
    logout(userId: string): Promise<{
        message: string;
    }>;
    private sign;
    private generateRefreshToken;
}
