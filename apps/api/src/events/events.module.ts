import { Module } from '@nestjs/common';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { ApiKeyGuard } from './guards/api-key.guard';
import { ApiKeysModule } from '../api-keys/api-keys.module';

@Module({
  imports: [ApiKeysModule],
  controllers: [EventsController],
  providers: [EventsService, ApiKeyGuard],
  exports: [EventsService],
})
export class EventsModule {}
