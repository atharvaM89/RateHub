import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { OwnerService } from './owner.service.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { RolesGuard } from '../auth/roles.guard.js';
import { Roles } from '../auth/roles.decorator.js';

@Controller('owner')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('STORE_OWNER')
export class OwnerController {
  constructor(private ownerService: OwnerService) {}

  @Get('dashboard')
  async getDashboard(@Req() req: any) {
    const stats = await this.ownerService.getDashboardStats(req.user.id);
    return {
      message: 'Store dashboard metrics retrieved successfully.',
      data: stats,
    };
  }

  @Get('ratings')
  async getRatings(@Req() req: any) {
    const ratings = await this.ownerService.getStoreRatings(req.user.id);
    return {
      message: 'Store ratings retrieved successfully.',
      data: ratings,
    };
  }
}
