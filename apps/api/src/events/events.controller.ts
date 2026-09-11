import { Controller, Post, Body, Req, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiSecurity } from '@nestjs/swagger';
import { EventsService } from './events.service';
import { IngestEventDto, IngestBatchDto } from './dto/event.dto';
import { ApiKeyGuard } from './guards/api-key.guard';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('Event Ingestion')
@ApiSecurity('api-key')
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Public()
  @UseGuards(ApiKeyGuard)
  @Post()
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOperation({ summary: 'Ingest a single analytics event' })
  async ingest(@Body() dto: IngestEventDto, @Req() req: any) {
    const result = await this.eventsService.ingest(
      dto as any,
      req.projectId,
      req.environment,
      req.ip,
    );
    return { success: true, data: result };
  }

  @Public()
  @UseGuards(ApiKeyGuard)
  @Post('batch')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOperation({ summary: 'Ingest a batch of analytics events' })
  async ingestBatch(@Body() dto: IngestBatchDto, @Req() req: any) {
    const result = await this.eventsService.ingestBatch(
      dto.events as any[],
      req.projectId,
      req.environment,
      req.ip,
    );
    return { success: true, data: result };
  }
}
