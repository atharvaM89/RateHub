import { PrismaService } from '../database/prisma.service.js';
import { CreateStoreDto } from './dto/create-store.dto.js';
import { GetStoresQueryDto } from './dto/get-stores.dto.js';
export declare class StoresService {
    private prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateStoreDto): Promise<{
        name: string;
        email: string;
        address: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        ownerId: string;
    }>;
    findAll(query: GetStoresQueryDto, currentUserId?: string): Promise<{
        data: {
            id: string;
            name: string;
            email: string;
            address: string;
            owner: {
                name: string;
                email: string;
            };
            averageRating: number | null;
            totalRatings: number;
            userRating: number | null;
        }[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    findOne(id: string, currentUserId?: string): Promise<{
        id: string;
        name: string;
        email: string;
        address: string;
        owner: {
            name: string;
            email: string;
        };
        averageRating: number | null;
        totalRatings: number;
        userRating: number | null;
    }>;
}
