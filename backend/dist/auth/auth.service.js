var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable, ConflictException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service.js';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { hashToken } from './jwt.strategy.js';
let AuthService = class AuthService {
    prisma;
    jwtService;
    constructor(prisma, jwtService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
    }
    async register(dto) {
        const existing = await this.prisma.user.findUnique({
            where: { email: dto.email.toLowerCase() },
        });
        if (existing) {
            throw new ConflictException('An account with this email already exists.');
        }
        const passwordHash = await argon2.hash(dto.password);
        const user = await this.prisma.user.create({
            data: {
                name: dto.name,
                email: dto.email.toLowerCase(),
                passwordHash,
                address: dto.address,
                roleId: 2,
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
    async login(dto) {
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
        const payload = { sub: user.id, role: user.role.name };
        const expiresInSeconds = 24 * 60 * 60;
        const token = this.jwtService.sign(payload, { expiresIn: `${expiresInSeconds}s` });
        const expiresAt = new Date(Date.now() + expiresInSeconds * 1000);
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
    async logout(token) {
        const tokenHash = hashToken(token);
        await this.prisma.session.updateMany({
            where: { tokenHash },
            data: { revokedAt: new Date() },
        });
    }
    async changePassword(userId, dto) {
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
};
AuthService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService,
        JwtService])
], AuthService);
export { AuthService };
//# sourceMappingURL=auth.service.js.map