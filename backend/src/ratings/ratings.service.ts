import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service.js';

@Injectable()
export class RatingsService {
  constructor(private prisma: PrismaService) {}

  async submitRating(userId: string, storeId: string, ratingValue: number) {
    const store = await this.prisma.store.findUnique({
      where: { id: storeId },
    });

    if (!store) {
      throw new NotFoundException('Store not found.');
    }

    // A user cannot rate their own store if they are the owner
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

  async modifyRating(userId: string, storeId: string, ratingValue: number) {
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

  async getRatingForStoreByUser(userId: string, storeId: string) {
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
}
