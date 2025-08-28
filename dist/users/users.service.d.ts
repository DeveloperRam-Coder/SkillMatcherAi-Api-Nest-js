import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
export declare class UsersService {
    private userModel;
    constructor(userModel: Model<UserDocument>);
    create(dto: CreateUserDto): Promise<User>;
    findByEmail(email: string, withPassword?: boolean): Promise<UserDocument | null>;
    findById(id: string): Promise<User>;
    updateRefreshToken(id: string, refreshToken: string): Promise<void>;
    toPublic(user: any): {
        id: any;
        name: any;
        email: any;
        role: any;
        createdAt: any;
        updatedAt: any;
    };
}
