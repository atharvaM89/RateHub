import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { DatabaseModule } from './database/database.module.js';
import { AuthModule } from './auth/auth.module.js';
import { UsersModule } from './users/users.module.js';
import { StoresModule } from './stores/stores.module.js';
import { AdminModule } from './admin/admin.module.js';
import { RatingsModule } from './ratings/ratings.module.js';
import { OwnerModule } from './owner/owner.module.js';

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    UsersModule,
    StoresModule,
    AdminModule,
    RatingsModule,
    OwnerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
