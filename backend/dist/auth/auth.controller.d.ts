import * as express from 'express';
import { AuthService } from './auth.service.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { ChangePasswordDto } from './dto/change-password.dto.js';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(dto: RegisterDto): Promise<{
        message: string;
        data: {
            id: string;
            name: string;
            email: string;
            role: string;
        };
    }>;
    login(dto: LoginDto, response: express.Response): Promise<{
        message: string;
        data: {
            id: string;
            name: string;
            email: string;
            role: string;
        };
    }>;
    logout(request: express.Request, response: express.Response): Promise<{
        message: string;
    }>;
    me(request: any): Promise<{
        message: string;
        data: any;
    }>;
    changePassword(request: any, dto: ChangePasswordDto, response: express.Response): Promise<{
        message: string;
    }>;
}
