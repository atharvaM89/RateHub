import { PrismaService } from '../database/prisma.service.js';
export declare class AdminService {
    private prisma;
    constructor(prisma: PrismaService);
    getDashboardStats(): Promise<{
        totalUsers: number;
        totalStores: number;
        totalRatings: number;
    }>;
}
