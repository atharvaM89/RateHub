import { Injectable, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { GetUsersQueryDto } from './dto/get-users.dto.js';
import * as argon2 from 'argon2';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async createUser(dto: CreateUserDto) {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });

    if (existing) {
      throw new ConflictException('An account with this email already exists.');
    }

    const role = await this.prisma.role.findUnique({
      where: { id: dto.roleId },
    });

    if (!role) {
      throw new BadRequestException('Invalid role selection.');
    }

    const passwordHash = await argon2.hash(dto.password);

    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email.toLowerCase(),
        passwordHash,
        address: dto.address,
        roleId: dto.roleId,
        isActive: true,
      },
      include: {
        role: true,
      },
    });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      address: user.address,
      role: user.role.name,
    };
  }

  async findAll(query: GetUsersQueryDto) {
    const { page = 1, limit = 20, name, email, address, role, sortBy = 'name', sortOrder = 'asc' } = query;
    const skip = (page - 1) * limit;

    // Build filter conditions
    const where: any = {};
    if (name) {
      where.name = { contains: name, mode: 'insensitive' };
    }
    if (email) {
      where.email = { contains: email, mode: 'insensitive' };
    }
    if (address) {
      where.address = { contains: address, mode: 'insensitive' };
    }
    if (role) {
      where.role = { name: { equals: role, mode: 'insensitive' } };
    }

    // Build sorting condition
    let orderBy: any = {};
    if (sortBy === 'role') {
      orderBy = { role: { name: sortOrder } };
    } else {
      orderBy = { [sortBy]: sortOrder };
    }

    // Run parallel queries for pagination speed
    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          role: true,
        },
      }),
      this.prisma.user.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: users.map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        address: u.address,
        role: u.role.name,
        isActive: u.isActive,
      })),
      meta: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        role: true,
        ownedStore: {
          include: {
            ratings: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    let storeDetails = null;
    if (user.role.name === 'STORE_OWNER' && user.ownedStore) {
      // Calculate overall rating for the owned store
      const ratings = user.ownedStore.ratings;
      const totalRatings = ratings.length;
      const averageRating = totalRatings > 0 
        ? parseFloat((ratings.reduce((acc, curr) => acc + curr.rating, 0) / totalRatings).toFixed(2))
        : null;

      storeDetails = {
        id: user.ownedStore.id,
        name: user.ownedStore.name,
        email: user.ownedStore.email,
        address: user.ownedStore.address,
        averageRating,
      };
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      address: user.address,
      role: user.role.name,
      isActive: user.isActive,
      store: storeDetails,
    };
  }
}
