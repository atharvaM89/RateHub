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
import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { OwnerService } from './owner.service.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { RolesGuard } from '../auth/roles.guard.js';
import { Roles } from '../auth/roles.decorator.js';
let OwnerController = class OwnerController {
    ownerService;
    constructor(ownerService) {
        this.ownerService = ownerService;
    }
    async getDashboard(req) {
        const stats = await this.ownerService.getDashboardStats(req.user.id);
        return {
            message: 'Store dashboard metrics retrieved successfully.',
            data: stats,
        };
    }
    async getRatings(req) {
        const ratings = await this.ownerService.getStoreRatings(req.user.id);
        return {
            message: 'Store ratings retrieved successfully.',
            data: ratings,
        };
    }
};
__decorate([
    Get('dashboard'),
    __param(0, Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OwnerController.prototype, "getDashboard", null);
__decorate([
    Get('ratings'),
    __param(0, Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OwnerController.prototype, "getRatings", null);
OwnerController = __decorate([
    Controller('owner'),
    UseGuards(JwtAuthGuard, RolesGuard),
    Roles('STORE_OWNER'),
    __metadata("design:paramtypes", [OwnerService])
], OwnerController);
export { OwnerController };
//# sourceMappingURL=owner.controller.js.map