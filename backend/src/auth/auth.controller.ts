import { Controller, Post, Body, Res, Req, UseGuards, Get, Patch, HttpCode, HttpStatus } from '@nestjs/common';
import * as express from 'express';
import { AuthService } from './auth.service.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { ChangePasswordDto } from './dto/change-password.dto.js';
import { JwtAuthGuard } from './jwt-auth.guard.js';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    const user = await this.authService.register(dto);
    return {
      message: 'Account created successfully. Please log in to continue.',
      data: user,
    };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) response: express.Response,
  ) {
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

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async logout(
    @Req() request: express.Request,
    @Res({ passthrough: true }) response: express.Response,
  ) {
    const token = request.cookies['auth-token'];
    if (token) {
      await this.authService.logout(token);
    }
    response.clearCookie('auth-token');
    return {
      message: 'Logout successful',
    };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async me(@Req() request: any) {
    return {
      message: 'Profile retrieved successfully',
      data: request.user,
    };
  }

  @Patch('password')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async changePassword(
    @Req() request: any,
    @Body() dto: ChangePasswordDto,
    @Res({ passthrough: true }) response: express.Response,
  ) {
    await this.authService.changePassword(request.user.id, dto);
    response.clearCookie('auth-token');
    return {
      message: 'Password updated successfully. Please log in again.',
    };
  }
}
