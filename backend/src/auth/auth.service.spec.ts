import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service.js';
import { PrismaService } from '../database/prisma.service.js';
import { JwtService } from '@nestjs/jwt';
import { ConflictException } from '@nestjs/common';
import { vi, describe, beforeEach, it, expect } from 'vitest';

describe('AuthService', () => {
  let service: AuthService;
  
  const mockPrismaService = {
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
    role: {
      findUnique: vi.fn(),
    },
  };

  const mockJwtService = {
    sign: vi.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should throw ConflictException if user already exists', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue({ id: '1', email: 'test@example.com' });

      await expect(
        service.register({
          name: 'Test User Full Name Longer',
          email: 'test@example.com',
          address: 'Test Address Pune',
          password: 'Password@123',
        }),
      ).rejects.toThrow(ConflictException);
    });
  });
});
