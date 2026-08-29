import { RatingsService } from './ratings.service.js';
import { CreateRatingDto } from './dto/create-rating.dto.js';
export declare class RatingsController {
    private ratingsService;
    constructor(ratingsService: RatingsService);
    submitRating(req: any, storeId: string, dto: CreateRatingDto): Promise<{
        message: string;
        data: {
            rating: number;
            id: string;
            userId: string;
            createdAt: Date;
            updatedAt: Date;
            storeId: string;
        };
    }>;
    modifyRating(req: any, storeId: string, dto: CreateRatingDto): Promise<{
        message: string;
        data: {
            rating: number;
            id: string;
            userId: string;
            createdAt: Date;
            updatedAt: Date;
            storeId: string;
        };
    }>;
    getMyRating(req: any, storeId: string): Promise<{
        message: string;
        data: {
            id: string;
            rating: number;
            storeId: string;
            userId: string;
        } | null;
    }>;
}
