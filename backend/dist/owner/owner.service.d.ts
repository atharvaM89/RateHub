import { PrismaService } from '../database/prisma.service.js';
export declare class OwnerService {
    private prisma;
    constructor(prisma: PrismaService);
    getDashboardStats(ownerId: string): Promise<{
        store: {
            id: string;
            name: string;
        };
        averageRating: number | null;
        totalRatings: number;
    }>;
    getStoreRatings(ownerId: string): Promise<{
        userName: string;
        email: string;
        rating: number;
        createdAt: Date;
    }[]>;
}
