import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service.js';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getDashboardStats() {
    const [totalUsers, totalStores, totalRatings] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.store.count(),
      this.prisma.rating.count(),
    ]);

    return {
      totalUsers,
      totalStores,
      totalRatings,
    };
  }
}
