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
import { Controller, Post, Get, Body, Query, Param, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { GetUsersQueryDto } from './dto/get-users.dto.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { RolesGuard } from '../auth/roles.guard.js';
import { Roles } from '../auth/roles.decorator.js';
let UsersController = class UsersController {
    usersService;
    constructor(usersService) {
        this.usersService = usersService;
    }
    async createUser(dto) {
        const user = await this.usersService.createUser(dto);
        return {
            message: 'User created successfully.',
            data: user,
        };
    }
    async findAll(query) {
        const result = await this.usersService.findAll(query);
        return {
            message: 'Users retrieved successfully.',
            data: result.data,
            meta: result.meta,
        };
    }
    async findOne(id) {
        const user = await this.usersService.findOne(id);
        return {
            message: 'User details retrieved successfully.',
            data: user,
        };
    }
};
__decorate([
    Post(),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateUserDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "createUser", null);
__decorate([
    Get(),
    __param(0, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [GetUsersQueryDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "findAll", null);
__decorate([
    Get(':id'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "findOne", null);
UsersController = __decorate([
    Controller('users'),
    UseGuards(JwtAuthGuard, RolesGuard),
    Roles('ADMIN'),
    __metadata("design:paramtypes", [UsersService])
], UsersController);
export { UsersController };
//# sourceMappingURL=users.controller.js.map