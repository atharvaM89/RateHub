import { StoresService } from './stores.service.js';
import { CreateStoreDto } from './dto/create-store.dto.js';
import { GetStoresQueryDto } from './dto/get-stores.dto.js';
export declare class StoresController {
    private storesService;
    constructor(storesService: StoresService);
    create(dto: CreateStoreDto): Promise<{
        message: string;
        data: {
            name: string;
            email: string;
            address: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            ownerId: string;
        };
    }>;
    findAll(req: any, query: GetStoresQueryDto): Promise<{
        message: string;
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
    findOne(req: any, id: string): Promise<{
        message: string;
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
        };
    }>;
}
