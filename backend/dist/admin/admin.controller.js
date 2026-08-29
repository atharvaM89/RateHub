var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Controller, Get, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { RolesGuard } from '../auth/roles.guard.js';
import { Roles } from '../auth/roles.decorator.js';
let AdminController = class AdminController {
    adminService;
    constructor(adminService) {
        this.adminService = adminService;
    }
    async getStats() {
        const stats = await this.adminService.getDashboardStats();
        return {
            message: 'Admin dashboard statistics retrieved successfully.',
            data: stats,
        };
    }
};
__decorate([
    Get('dashboard'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getStats", null);
AdminController = __decorate([
    Controller('admin'),
    UseGuards(JwtAuthGuard, RolesGuard),
    Roles('ADMIN'),
    __metadata("design:paramtypes", [AdminService])
], AdminController);
export { AdminController };
//# sourceMappingURL=admin.controller.js.map