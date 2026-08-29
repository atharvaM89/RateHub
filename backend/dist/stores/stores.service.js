var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable, ConflictException, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service.js';
let StoresService = class StoresService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto) {
        const owner = await this.prisma.user.findUnique({
            where: { id: dto.ownerId },
            include: { role: true },
        });
        if (!owner) {
            throw new BadRequestException('Selected store owner is not available.');
        }
        if (owner.role.name !== 'STORE_OWNER') {
            throw new BadRequestException('Selected user does not have the STORE_OWNER role.');
        }
        const existingStore = await this.prisma.store.findUnique({
            where: { ownerId: dto.ownerId },
        });
        if (existingStore) {
            throw new ConflictException('This store owner is already assigned to a store.');
        }
        const store = await this.prisma.store.create({
            data: {
                name: dto.name,
                email: dto.email.toLowerCase(),
                address: dto.address,
                ownerId: dto.ownerId,
            },
        });
        return store;
    }
    async findAll(query, currentUserId) {
        const { page = 1, limit = 20, search, address, sortBy = 'name', sortOrder = 'asc' } = query;
        const skip = (page - 1) * limit;
        const where = {};
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
            ];
        }
        if (address) {
            where.address = { contains: address, mode: 'insensitive' };
        }
        const [stores, total] = await Promise.all([
            this.prisma.store.findMany({
                where,
                skip,
                take: limit,
                include: {
                    ratings: true,
                    owner: {
                        select: {
                            name: true,
                            email: true,
                        },
                    },
                },
            }),
            this.prisma.store.count({ where }),
        ]);
        const mappedStores = stores.map((store) => {
            const ratings = store.ratings;
            const totalRatings = ratings.length;
            const averageRating = totalRatings > 0
                ? parseFloat((ratings.reduce((acc, curr) => acc + curr.rating, 0) / totalRatings).toFixed(2))
                : null;
            const userRating = currentUserId
                ? (ratings.find((r) => r.userId === currentUserId)?.rating ?? null)
                : null;
            return {
                id: store.id,
                name: store.name,
                email: store.email,
                address: store.address,
                owner: store.owner,
                averageRating,
                totalRatings,
                userRating,
            };
        });
        if (sortBy === 'rating') {
            mappedStores.sort((a, b) => {
                const ratingA = a.averageRating ?? 0;
                const ratingB = b.averageRating ?? 0;
                return sortOrder === 'asc' ? ratingA - ratingB : ratingB - ratingA;
            });
        }
        else {
            mappedStores.sort((a, b) => {
                const fieldA = a[sortBy] || '';
                const fieldB = b[sortBy] || '';
                return sortOrder === 'asc'
                    ? String(fieldA).localeCompare(String(fieldB))
                    : String(fieldB).localeCompare(String(fieldA));
            });
        }
        const totalPages = Math.ceil(total / limit);
        return {
            data: mappedStores,
            meta: {
                page,
                limit,
                total,
                totalPages,
            },
        };
    }
    async findOne(id, currentUserId) {
        const store = await this.prisma.store.findUnique({
            where: { id },
            include: {
                ratings: true,
                owner: {
                    select: {
                        name: true,
                        email: true,
                    },
                },
            },
        });
        if (!store) {
            throw new NotFoundException('Store not found.');
        }
        const ratings = store.ratings;
        const totalRatings = ratings.length;
        const averageRating = totalRatings > 0
            ? parseFloat((ratings.reduce((acc, curr) => acc + curr.rating, 0) / totalRatings).toFixed(2))
            : null;
        const userRating = currentUserId
            ? (ratings.find((r) => r.userId === currentUserId)?.rating ?? null)
            : null;
        return {
            id: store.id,
            name: store.name,
            email: store.email,
            address: store.address,
            owner: store.owner,
            averageRating,
            totalRatings,
            userRating,
        };
    }
};
StoresService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], StoresService);
export { StoresService };
//# sourceMappingURL=stores.service.js.map