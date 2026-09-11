import type { ClickHouseClient } from '@clickhouse/client';
import type { EnrichedAnalyticsEvent } from '@pulsemetrics/shared';

export class ClickHouseWriter {
  constructor(private readonly client: ClickHouseClient) {}

  async writeBatch(events: unknown[]): Promise<void> {
    if (events.length === 0) return;

    const rows = (events as EnrichedAnalyticsEvent[]).map((event) => ({
      event_id: event.eventId,
      project_id: event.projectId,
      timestamp: event.timestamp,
      event_name: event.event,
      user_id: event.userId ?? '',
      session_id: event.sessionId,
      page: event.page ?? '',
      referrer: event.referrer ?? '',
      country: event.geo?.country ?? '',
      city: event.geo?.city ?? '',
      region: event.geo?.region ?? '',
      device: event.context?.device ?? 'desktop',
      browser: event.context?.browser ?? '',
      browser_version: event.context?.browserVersion ?? '',
      os: event.context?.os ?? '',
      os_version: event.context?.osVersion ?? '',
      screen_width: event.context?.screenWidth ?? 0,
      screen_height: event.context?.screenHeight ?? 0,
      language: event.context?.language ?? 'en',
      ip_hash: event.ipHash ?? '',
      sdk_version: event.sdk?.version ?? '',
      environment: event.environment,
      properties: JSON.stringify(event.properties ?? {}),
      duration_ms: 0,
      status_code: 0,
      ingested_at: event.processingMetadata?.ingestedAt ?? new Date().toISOString(),
      processed_at: event.processingMetadata?.processedAt ?? new Date().toISOString(),
    }));

    await this.client.insert({
      table: 'events',
      values: rows,
      format: 'JSONEachRow',
    });
  }
}
