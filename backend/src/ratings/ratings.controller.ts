import { Controller, Post, Patch, Get, Body, Param, Req, UseGuards, HttpStatus, HttpCode } from '@nestjs/common';
import { RatingsService } from './ratings.service.js';
import { CreateRatingDto } from './dto/create-rating.dto.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { RolesGuard } from '../auth/roles.guard.js';
import { Roles } from '../auth/roles.decorator.js';

@Controller('stores/:storeId/ratings')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('USER')
export class RatingsController {
  constructor(private ratingsService: RatingsService) {}

  @Post()
  async submitRating(
    @Req() req: any,
    @Param('storeId') storeId: string,
    @Body() dto: CreateRatingDto,
  ) {
    const rating = await this.ratingsService.submitRating(req.user.id, storeId, dto.rating);
    return {
      message: 'Rating submitted successfully.',
      data: rating,
    };
  }

  @Patch()
  @HttpCode(HttpStatus.OK)
  async modifyRating(
    @Req() req: any,
    @Param('storeId') storeId: string,
    @Body() dto: CreateRatingDto,
  ) {
    const rating = await this.ratingsService.modifyRating(req.user.id, storeId, dto.rating);
    return {
      message: 'Rating updated successfully.',
      data: rating,
    };
  }

  @Get('me')
  async getMyRating(
    @Req() req: any,
    @Param('storeId') storeId: string,
  ) {
    const rating = await this.ratingsService.getRatingForStoreByUser(req.user.id, storeId);
    return {
      message: 'User rating retrieved successfully.',
      data: rating,
    };
  }
}
