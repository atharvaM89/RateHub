import { Injectable, ConflictException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { ChangePasswordDto } from './dto/change-password.dto.js';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { hashToken } from './jwt.strategy.js';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });

    if (existing) {
      throw new ConflictException('An account with this email already exists.');
    }

    const passwordHash = await argon2.hash(dto.password);

    // Register user with normal USER role (id: 2)
    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email.toLowerCase(),
        passwordHash,
        address: dto.address,
        roleId: 2, // USER
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
      role: user.role.name,
    };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
      include: { role: true },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    const isPasswordValid = await argon2.verify(user.passwordHash, dto.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    // Generate JWT
    const payload = { sub: user.id, role: user.role.name };
    const expiresInSeconds = 24 * 60 * 60; // 24 hours
    const token = this.jwtService.sign(payload, { expiresIn: `${expiresInSeconds}s` });
    const expiresAt = new Date(Date.now() + expiresInSeconds * 1000);

    // Create session in database
    const tokenHash = hashToken(token);
    await this.prisma.session.create({
      data: {
        userId: user.id,
        tokenHash,
        expiresAt,
      },
    });

    return {
      token,
      expiresAt,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role.name,
      },
    };
  }

  async logout(token: string) {
    const tokenHash = hashToken(token);
    
    // Revoke session in database
    await this.prisma.session.updateMany({
      where: { tokenHash },
      data: { revokedAt: new Date() },
    });
  }

  async changePassword(userId: string, dto: ChangePasswordDto) {
    if (dto.newPassword !== dto.confirmPassword) {
      throw new BadRequestException('Passwords do not match.');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('User not found.');
    }

    const isPasswordValid = await argon2.verify(user.passwordHash, dto.currentPassword);
    if (!isPasswordValid) {
      throw new BadRequestException('Current password is incorrect.');
    }

    const newPasswordHash = await argon2.hash(dto.newPassword);

    await this.prisma.user.update({
      where: { id: userId },
      data: { passwordHash: newPasswordHash },
    });

    // Revoke all other active sessions for this user for security
    await this.prisma.session.updateMany({
      where: {
        userId,
        revokedAt: null,
      },
      data: {
        revokedAt: new Date(),
      },
    });
  }
}
