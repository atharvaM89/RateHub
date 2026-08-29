import { PrismaService } from '../database/prisma.service.js';
export declare class RatingsService {
    private prisma;
    constructor(prisma: PrismaService);
    submitRating(userId: string, storeId: string, ratingValue: number): Promise<{
        rating: number;
        id: string;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
        storeId: string;
    }>;
    modifyRating(userId: string, storeId: string, ratingValue: number): Promise<{
        rating: number;
        id: string;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
        storeId: string;
    }>;
    getRatingForStoreByUser(userId: string, storeId: string): Promise<{
        id: string;
        rating: number;
        storeId: string;
        userId: string;
    } | null>;
}
