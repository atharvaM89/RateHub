import { Controller, Post, Get, Body, Query, Param, UseGuards, Req } from '@nestjs/common';
import { StoresService } from './stores.service.js';
import { CreateStoreDto } from './dto/create-store.dto.js';
import { GetStoresQueryDto } from './dto/get-stores.dto.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { RolesGuard } from '../auth/roles.guard.js';
import { Roles } from '../auth/roles.decorator.js';

@Controller('stores')
@UseGuards(JwtAuthGuard, RolesGuard)
export class StoresController {
  constructor(private storesService: StoresService) {}

  @Post()
  @Roles('ADMIN')
  async create(@Body() dto: CreateStoreDto) {
    const store = await this.storesService.create(dto);
    return {
      message: 'Store created successfully.',
      data: store,
    };
  }

  @Get()
  async findAll(@Req() req: any, @Query() query: GetStoresQueryDto) {
    const result = await this.storesService.findAll(query, req.user?.id);
    return {
      message: 'Stores retrieved successfully.',
      data: result.data,
      meta: result.meta,
    };
  }

  @Get(':id')
  async findOne(@Req() req: any, @Param('id') id: string) {
    const store = await this.storesService.findOne(id, req.user?.id);
    return {
      message: 'Store details retrieved successfully.',
      data: store,
    };
  }
}
