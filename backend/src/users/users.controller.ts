import { Controller, Post, Get, Body, Query, Param, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { GetUsersQueryDto } from './dto/get-users.dto.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { RolesGuard } from '../auth/roles.guard.js';
import { Roles } from '../auth/roles.decorator.js';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  async createUser(@Body() dto: CreateUserDto) {
    const user = await this.usersService.createUser(dto);
    return {
      message: 'User created successfully.',
      data: user,
    };
  }

  @Get()
  async findAll(@Query() query: GetUsersQueryDto) {
    const result = await this.usersService.findAll(query);
    return {
      message: 'Users retrieved successfully.',
      data: result.data,
      meta: result.meta,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findOne(id);
    return {
      message: 'User details retrieved successfully.',
      data: user,
    };
  }
}
