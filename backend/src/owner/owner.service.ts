import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service.js';

@Injectable()
export class OwnerService {
  constructor(private prisma: PrismaService) {}

  async getDashboardStats(ownerId: string) {
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

  async getStoreRatings(ownerId: string) {
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
}
