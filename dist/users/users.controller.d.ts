import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getById(id: string): Promise<{
        id: any;
        name: any;
        email: any;
        role: any;
        createdAt: any;
        updatedAt: any;
    }>;
}
