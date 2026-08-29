import { AdminService } from './admin.service.js';
export declare class AdminController {
    private adminService;
    constructor(adminService: AdminService);
    getStats(): Promise<{
        message: string;
        data: {
            totalUsers: number;
            totalStores: number;
            totalRatings: number;
        };
    }>;
}
