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
import { Controller, Post, Get, Body, Query, Param, UseGuards, Req } from '@nestjs/common';
import { StoresService } from './stores.service.js';
import { CreateStoreDto } from './dto/create-store.dto.js';
import { GetStoresQueryDto } from './dto/get-stores.dto.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { RolesGuard } from '../auth/roles.guard.js';
import { Roles } from '../auth/roles.decorator.js';
let StoresController = class StoresController {
    storesService;
    constructor(storesService) {
        this.storesService = storesService;
    }
    async create(dto) {
        const store = await this.storesService.create(dto);
        return {
            message: 'Store created successfully.',
            data: store,
        };
    }
    async findAll(req, query) {
        const result = await this.storesService.findAll(query, req.user?.id);
        return {
            message: 'Stores retrieved successfully.',
            data: result.data,
            meta: result.meta,
        };
    }
    async findOne(req, id) {
        const store = await this.storesService.findOne(id, req.user?.id);
        return {
            message: 'Store details retrieved successfully.',
            data: store,
        };
    }
};
__decorate([
    Post(),
    Roles('ADMIN'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateStoreDto]),
    __metadata("design:returntype", Promise)
], StoresController.prototype, "create", null);
__decorate([
    Get(),
    __param(0, Req()),
    __param(1, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, GetStoresQueryDto]),
    __metadata("design:returntype", Promise)
], StoresController.prototype, "findAll", null);
__decorate([
    Get(':id'),
    __param(0, Req()),
    __param(1, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], StoresController.prototype, "findOne", null);
StoresController = __decorate([
    Controller('stores'),
    UseGuards(JwtAuthGuard, RolesGuard),
    __metadata("design:paramtypes", [StoresService])
], StoresController);
export { StoresController };
//# sourceMappingURL=stores.controller.js.map