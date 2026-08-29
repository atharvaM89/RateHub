var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service.js';
import * as crypto from 'crypto';
const cookieExtractor = (req) => {
    if (req && req.cookies) {
        return req.cookies['auth-token'] || null;
    }
    return null;
};
export function hashToken(token) {
    return crypto.createHash('sha256').update(token).digest('hex');
}
let JwtStrategy = class JwtStrategy extends PassportStrategy(Strategy) {
    prisma;
    constructor(prisma) {
        super({
            jwtFromRequest: cookieExtractor,
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET || 'super-secret-jwt-key-change-in-production',
            passReqToCallback: true,
        });
        this.prisma = prisma;
    }
    async validate(req, payload) {
        const token = cookieExtractor(req);
        if (!token) {
            throw new UnauthorizedException('No credentials token found');
        }
        const tokenHash = hashToken(token);
        const session = await this.prisma.session.findUnique({
            where: { tokenHash },
        });
        if (!session || session.userId !== payload.sub) {
            throw new UnauthorizedException('Invalid or revoked session');
        }
        if (session.revokedAt) {
            throw new UnauthorizedException('Session has been revoked');
        }
        if (new Date() > new Date(session.expiresAt)) {
            throw new UnauthorizedException('Session expired');
        }
        const user = await this.prisma.user.findUnique({
            where: { id: payload.sub },
            include: { role: true },
        });
        if (!user || !user.isActive) {
            throw new UnauthorizedException('User account is inactive or not found');
        }
        this.prisma.session.update({
            where: { id: session.id },
            data: { lastUsedAt: new Date() },
        }).catch(e => console.error('Failed to update lastUsedAt:', e));
        return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role.name,
            roleId: user.roleId,
            sessionId: session.id,
        };
    }
};
JwtStrategy = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], JwtStrategy);
export { JwtStrategy };
//# sourceMappingURL=jwt.strategy.js.map