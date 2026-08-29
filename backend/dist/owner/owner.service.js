var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service.js';
let OwnerService = class OwnerService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getDashboardStats(ownerId) {
        const store = await this.prisma.store.findUnique({
            where: { ownerId },
            include: {
                ratings: true,
            },
        });
        if (!store) {
            throw new NotFoundException('No store found associated with this owner account.');
        }
        const ratings = store.ratings;
        const totalRatings = ratings.length;
        const averageRating = totalRatings > 0
            ? parseFloat((ratings.reduce((acc, curr) => acc + curr.rating, 0) / totalRatings).toFixed(2))
            : null;
        return {
            store: {
                id: store.id,
                name: store.name,
            },
            averageRating,
            totalRatings,
        };
    }
    async getStoreRatings(ownerId) {
        const store = await this.prisma.store.findUnique({
            where: { ownerId },
            include: {
                ratings: {
                    include: {
                        user: {
                            select: {
                                name: true,
                                email: true,
                            },
                        },
                    },
                    orderBy: {
                        createdAt: 'desc',
                    },
                },
            },
        });
        if (!store) {
            throw new NotFoundException('No store found associated with this owner account.');
        }
        return store.ratings.map((r) => ({
            userName: r.user.name,
            email: r.user.email,
            rating: r.rating,
            createdAt: r.createdAt,
        }));
    }
};
OwnerService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], OwnerService);
export { OwnerService };
//# sourceMappingURL=owner.service.js.map