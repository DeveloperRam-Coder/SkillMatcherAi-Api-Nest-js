import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private readonly auth;
    constructor(auth: AuthService);
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
    getCurrentUser(req: any): Promise<{
        _id: import("mongoose").Types.ObjectId;
        name: string;
        email: string;
        role: string;
    }>;
    refreshToken(body: {
        refreshToken: string;
    }): Promise<{
        token: string;
    }>;
    logout(req: any): Promise<{
        message: string;
    }>;
}
