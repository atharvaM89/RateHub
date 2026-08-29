import { Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { PrismaService } from '../database/prisma.service.js';
import * as crypto from 'crypto';

const cookieExtractor = (req: Request): string | null => {
  if (req && req.cookies) {
    return req.cookies['auth-token'] || null;
  }
  return null;
};

export function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: cookieExtractor,
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'super-secret-jwt-key-change-in-production',
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: any) {
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
}
