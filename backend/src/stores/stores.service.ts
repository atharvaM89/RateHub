import { Injectable, ConflictException, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service.js';
import { CreateStoreDto } from './dto/create-store.dto.js';
import { GetStoresQueryDto } from './dto/get-stores.dto.js';

@Injectable()
export class StoresService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateStoreDto) {
    // 1. Verify owner exists and has STORE_OWNER role
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

    // 2. Check if owner already owns a store
    const existingStore = await this.prisma.store.findUnique({
      where: { ownerId: dto.ownerId },
    });

    if (existingStore) {
      throw new ConflictException('This store owner is already assigned to a store.');
    }

    // 3. Create the store
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

  async findAll(query: GetStoresQueryDto, currentUserId?: string) {
    const { page = 1, limit = 20, search, address, sortBy = 'name', sortOrder = 'asc' } = query;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (address) {
      where.address = { contains: address, mode: 'insensitive' };
    }

    // Query stores with ratings included
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

    // Map store results to calculate ratings and user ratings
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

    // If sorting by averageRating, sort in Javascript since it's a derived field
    if (sortBy === 'rating') {
      mappedStores.sort((a, b) => {
        const ratingA = a.averageRating ?? 0;
        const ratingB = b.averageRating ?? 0;
        return sortOrder === 'asc' ? ratingA - ratingB : ratingB - ratingA;
      });
    } else {
      // Sort by other text fields like name/email/address
      mappedStores.sort((a, b) => {
        const fieldA = (a as any)[sortBy] || '';
        const fieldB = (b as any)[sortBy] || '';
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

  async findOne(id: string, currentUserId?: string) {
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
}
