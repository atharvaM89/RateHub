import { PrismaService } from '../database/prisma.service.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { ChangePasswordDto } from './dto/change-password.dto.js';
import { JwtService } from '@nestjs/jwt';
export declare class AuthService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    register(dto: RegisterDto): Promise<{
        id: string;
        name: string;
        email: string;
        role: string;
    }>;
    login(dto: LoginDto): Promise<{
        token: string;
        expiresAt: Date;
        user: {
            id: string;
            name: string;
            email: string;
            role: string;
        };
    }>;
    logout(token: string): Promise<void>;
    changePassword(userId: string, dto: ChangePasswordDto): Promise<void>;
}
