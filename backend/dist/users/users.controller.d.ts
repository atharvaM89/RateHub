import { UsersService } from './users.service.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { GetUsersQueryDto } from './dto/get-users.dto.js';
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
    createUser(dto: CreateUserDto): Promise<{
        message: string;
        data: {
            id: string;
            name: string;
            email: string;
            address: string;
            role: string;
        };
    }>;
    findAll(query: GetUsersQueryDto): Promise<{
        message: string;
        data: {
            id: string;
            name: string;
            email: string;
            address: string;
            role: string;
            isActive: boolean;
        }[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<{
        message: string;
        data: {
            id: string;
            name: string;
            email: string;
            address: string;
            role: string;
            isActive: boolean;
            store: {
                id: string;
                name: string;
                email: string;
                address: string;
                averageRating: number | null;
            } | null;
        };
    }>;
}
