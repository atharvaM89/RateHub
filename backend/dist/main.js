import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { TransformInterceptor } from './common/interceptors/transform.interceptor.js';
import { HttpExceptionFilter } from './common/filters/http-exception.filter.js';
async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.setGlobalPrefix('api/v1');
    app.use(helmet());
    app.use(cookieParser(process.env.COOKIE_SECRET || 'super-secret-cookie-key-change-in-production'));
    app.enableCors({
        origin: process.env.FRONTEND_URL || 'http://localhost:5173',
        credentials: true,
    });
    app.useGlobalFilters(new HttpExceptionFilter());
    app.useGlobalInterceptors(new TransformInterceptor());
    app.useGlobalPipes(new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
    }));
    const config = new DocumentBuilder()
        .setTitle('RateHub API')
        .setDescription('RateHub Role-Based Store Rating Platform API')
        .setVersion('1.0')
        .addCookieAuth('auth-token')
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);
    const port = process.env.PORT || 3000;
    await app.listen(port);
    console.log(`RateHub API is running on: http://localhost:${port}/api/v1`);
    console.log(`Swagger documentation available at: http://localhost:${port}/api/docs`);
}
await bootstrap();
//# sourceMappingURL=main.js.map