var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Controller, Post, Body, Res, Req, UseGuards, Get, Patch, HttpCode, HttpStatus } from '@nestjs/common';
import * as express from 'express';
import { AuthService } from './auth.service.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { ChangePasswordDto } from './dto/change-password.dto.js';
import { JwtAuthGuard } from './jwt-auth.guard.js';
let AuthController = class AuthController {
    authService;
    constructor(authService) {
        this.authService = authService;
    }
    async register(dto) {
        const user = await this.authService.register(dto);
        return {
            message: 'Account created successfully. Please log in to continue.',
            data: user,
        };
    }
    async login(dto, response) {
        const result = await this.authService.login(dto);
        const isProd = process.env.NODE_ENV === 'production';
        response.cookie('auth-token', result.token, {
            httpOnly: true,
            secure: isProd,
            sameSite: isProd ? 'none' : 'lax',
            expires: result.expiresAt,
        });
        return {
            message: 'Login successful',
            data: result.user,
        };
    }
    async logout(request, response) {
        const token = request.cookies['auth-token'];
        if (token) {
            await this.authService.logout(token);
        }
        response.clearCookie('auth-token');
        return {
            message: 'Logout successful',
        };
    }
    async me(request) {
        return {
            message: 'Profile retrieved successfully',
            data: request.user,
        };
    }
    async changePassword(request, dto, response) {
        await this.authService.changePassword(request.user.id, dto);
        response.clearCookie('auth-token');
        return {
            message: 'Password updated successfully. Please log in again.',
        };
    }
};
__decorate([
    Post('register'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [RegisterDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    Post('login'),
    HttpCode(HttpStatus.OK),
    __param(0, Body()),
    __param(1, Res({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [LoginDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    Post('logout'),
    UseGuards(JwtAuthGuard),
    HttpCode(HttpStatus.OK),
    __param(0, Req()),
    __param(1, Res({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
__decorate([
    Get('me'),
    UseGuards(JwtAuthGuard),
    __param(0, Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "me", null);
__decorate([
    Patch('password'),
    UseGuards(JwtAuthGuard),
    HttpCode(HttpStatus.OK),
    __param(0, Req()),
    __param(1, Body()),
    __param(2, Res({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, ChangePasswordDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "changePassword", null);
AuthController = __decorate([
    Controller('auth'),
    __metadata("design:paramtypes", [AuthService])
], AuthController);
export { AuthController };
//# sourceMappingURL=auth.controller.js.map