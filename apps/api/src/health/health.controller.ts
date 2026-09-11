import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  @Get()
  @ApiOperation({ summary: 'Overall system health check' })
  check() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'pulsemetrics-api',
      version: '0.1.0',
      uptime: process.uptime(),
    };
  }

  @Get('components')
  @ApiOperation({ summary: 'Component-level health status' })
  components() {
    // TODO: Implement real health checks in Phase 11
    return {
      components: [
        { name: 'api_gateway', status: 'healthy', latency: 0 },
        { name: 'database', status: 'healthy', latency: 0 },
        { name: 'redis', status: 'healthy', latency: 0 },
        { name: 'clickhouse', status: 'unknown', latency: 0 },
        { name: 'redpanda', status: 'unknown', latency: 0 },
        { name: 'workers', status: 'unknown', latency: 0 },
      ],
    };
  }
}
