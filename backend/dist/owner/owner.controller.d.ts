import { OwnerService } from './owner.service.js';
export declare class OwnerController {
    private ownerService;
    constructor(ownerService: OwnerService);
    getDashboard(req: any): Promise<{
        message: string;
        data: {
            store: {
                id: string;
                name: string;
            };
            averageRating: number | null;
            totalRatings: number;
        };
    }>;
    getRatings(req: any): Promise<{
        message: string;
        data: {
            userName: string;
            email: string;
            rating: number;
            createdAt: Date;
        }[];
    }>;
}
