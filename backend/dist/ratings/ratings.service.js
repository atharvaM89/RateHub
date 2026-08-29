var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service.js';
let RatingsService = class RatingsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async submitRating(userId, storeId, ratingValue) {
        const store = await this.prisma.store.findUnique({
            where: { id: storeId },
        });
        if (!store) {
            throw new NotFoundException('Store not found.');
        }
        if (store.ownerId === userId) {
            throw new BadRequestException('You cannot rate your own store.');
        }
        return this.prisma.rating.upsert({
            where: {
                userId_storeId: {
                    userId,
                    storeId,
                },
            },
            update: {
                rating: ratingValue,
            },
            create: {
                userId,
                storeId,
                rating: ratingValue,
            },
        });
    }
    async modifyRating(userId, storeId, ratingValue) {
        const existing = await this.prisma.rating.findUnique({
            where: {
                userId_storeId: {
                    userId,
                    storeId,
                },
            },
        });
        if (!existing) {
            throw new NotFoundException('Your rating could not be found. Please submit a rating first.');
        }
        return this.prisma.rating.update({
            where: {
                userId_storeId: {
                    userId,
                    storeId,
                },
            },
            data: {
                rating: ratingValue,
            },
        });
    }
    async getRatingForStoreByUser(userId, storeId) {
        const rating = await this.prisma.rating.findUnique({
            where: {
                userId_storeId: {
                    userId,
                    storeId,
                },
            },
        });
        if (!rating) {
            return null;
        }
        return {
            id: rating.id,
            rating: rating.rating,
            storeId: rating.storeId,
            userId: rating.userId,
        };
    }
};
RatingsService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], RatingsService);
export { RatingsService };
//# sourceMappingURL=ratings.service.js.map