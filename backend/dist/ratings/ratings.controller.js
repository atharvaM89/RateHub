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
import { Controller, Post, Patch, Get, Body, Param, Req, UseGuards, HttpStatus, HttpCode } from '@nestjs/common';
import { RatingsService } from './ratings.service.js';
import { CreateRatingDto } from './dto/create-rating.dto.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { RolesGuard } from '../auth/roles.guard.js';
import { Roles } from '../auth/roles.decorator.js';
let RatingsController = class RatingsController {
    ratingsService;
    constructor(ratingsService) {
        this.ratingsService = ratingsService;
    }
    async submitRating(req, storeId, dto) {
        const rating = await this.ratingsService.submitRating(req.user.id, storeId, dto.rating);
        return {
            message: 'Rating submitted successfully.',
            data: rating,
        };
    }
    async modifyRating(req, storeId, dto) {
        const rating = await this.ratingsService.modifyRating(req.user.id, storeId, dto.rating);
        return {
            message: 'Rating updated successfully.',
            data: rating,
        };
    }
    async getMyRating(req, storeId) {
        const rating = await this.ratingsService.getRatingForStoreByUser(req.user.id, storeId);
        return {
            message: 'User rating retrieved successfully.',
            data: rating,
        };
    }
};
__decorate([
    Post(),
    __param(0, Req()),
    __param(1, Param('storeId')),
    __param(2, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, CreateRatingDto]),
    __metadata("design:returntype", Promise)
], RatingsController.prototype, "submitRating", null);
__decorate([
    Patch(),
    HttpCode(HttpStatus.OK),
    __param(0, Req()),
    __param(1, Param('storeId')),
    __param(2, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, CreateRatingDto]),
    __metadata("design:returntype", Promise)
], RatingsController.prototype, "modifyRating", null);
__decorate([
    Get('me'),
    __param(0, Req()),
    __param(1, Param('storeId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], RatingsController.prototype, "getMyRating", null);
RatingsController = __decorate([
    Controller('stores/:storeId/ratings'),
    UseGuards(JwtAuthGuard, RolesGuard),
    Roles('USER'),
    __metadata("design:paramtypes", [RatingsService])
], RatingsController);
export { RatingsController };
//# sourceMappingURL=ratings.controller.js.map