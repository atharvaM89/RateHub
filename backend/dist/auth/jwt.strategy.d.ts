import { Strategy } from 'passport-jwt';
import { Request } from 'express';
import { PrismaService } from '../database/prisma.service.js';
export declare function hashToken(token: string): string;
declare const JwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStrategy extends JwtStrategy_base {
    private prisma;
    constructor(prisma: PrismaService);
    validate(req: Request, payload: any): Promise<{
        id: string;
        email: string;
        name: string;
        role: string;
        roleId: number;
        sessionId: string;
    }>;
}
export {};
