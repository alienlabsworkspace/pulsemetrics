import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { CurrentUser, AuthUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Analytics')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('overview')
  @ApiOperation({ summary: 'Get overview KPIs' })
  @ApiQuery({ name: 'projectId', required: true })
  @ApiQuery({ name: 'from', required: true })
  @ApiQuery({ name: 'to', required: true })
  async getOverview(
    @Query('projectId') projectId: string,
    @Query('from') from: string,
    @Query('to') to: string,
  ) {
    const data = await this.analyticsService.getOverview(projectId, from, to);
    return { success: true, data };
  }

  @Get('visitors')
  @ApiOperation({ summary: 'Get visitors time series' })
  async getVisitors(
    @Query('projectId') projectId: string,
    @Query('from') from: string,
    @Query('to') to: string,
    @Query('interval') interval?: string,
  ) {
    const data = await this.analyticsService.getVisitorsTimeSeries(projectId, from, to, interval);
    return { success: true, data };
  }

  @Get('pages')
  @ApiOperation({ summary: 'Get top pages' })
  async getTopPages(
    @Query('projectId') projectId: string,
    @Query('from') from: string,
    @Query('to') to: string,
    @Query('limit') limit?: number,
  ) {
    const data = await this.analyticsService.getTopPages(projectId, from, to, limit);
    return { success: true, data };
  }

  @Get('geo')
  @ApiOperation({ summary: 'Get geographic breakdown' })
  async getGeo(
    @Query('projectId') projectId: string,
    @Query('from') from: string,
    @Query('to') to: string,
  ) {
    const data = await this.analyticsService.getGeoBreakdown(projectId, from, to);
    return { success: true, data };
  }

  @Get('devices')
  @ApiOperation({ summary: 'Get device & browser breakdown' })
  async getDevices(
    @Query('projectId') projectId: string,
    @Query('from') from: string,
    @Query('to') to: string,
  ) {
    const data = await this.analyticsService.getDeviceBreakdown(projectId, from, to);
    return { success: true, data };
  }

  @Get('sources')
  @ApiOperation({ summary: 'Get traffic sources' })
  async getSources(
    @Query('projectId') projectId: string,
    @Query('from') from: string,
    @Query('to') to: string,
  ) {
    const data = await this.analyticsService.getSources(projectId, from, to);
    return { success: true, data };
  }

  @Get('realtime')
  @ApiOperation({ summary: 'Get real-time active users & ingestion rate' })
  async getRealtime(@Query('projectId') projectId: string) {
    const data = await this.analyticsService.getRealtime(projectId);
    return { success: true, data };
  }
}
