import { PrismaService } from '../database/prisma.service.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { GetUsersQueryDto } from './dto/get-users.dto.js';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    createUser(dto: CreateUserDto): Promise<{
        id: string;
        name: string;
        email: string;
        address: string;
        role: string;
    }>;
    findAll(query: GetUsersQueryDto): Promise<{
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
    }>;
}
