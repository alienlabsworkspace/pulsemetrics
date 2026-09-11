import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { OrganizationsModule } from './organizations/organizations.module';
import { ProjectsModule } from './projects/projects.module';
import { ApiKeysModule } from './api-keys/api-keys.module';
import { EventsModule } from './events/events.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { AlertsModule } from './alerts/alerts.module';
import { RealtimeModule } from './realtime/realtime.module';
import { HealthModule } from './health/health.module';
import { DatabaseModule } from './database/database.module';
import { RedisModule } from './common/redis/redis.module';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '../../.env'],
    }),

    // Rate limiting
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000,
        limit: 10,
      },
      {
        name: 'medium',
        ttl: 10000,
        limit: 50,
      },
      {
        name: 'long',
        ttl: 60000,
        limit: 100,
      },
    ]),

    // Infrastructure
    DatabaseModule,
    RedisModule,

    // Feature modules
    AuthModule,
    UsersModule,
    OrganizationsModule,
    ProjectsModule,
    ApiKeysModule,
    EventsModule,
    AnalyticsModule,
    AlertsModule,
    RealtimeModule,
    HealthModule,
  ],
})
export class AppModule {}
