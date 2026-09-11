import { v4 as uuidv4 } from 'uuid';
import type { EnrichedAnalyticsEvent } from '@pulsemetrics/shared';

export class EventProcessor {
  process(rawEvent: Record<string, unknown>): EnrichedAnalyticsEvent {
    const now = new Date().toISOString();

    return {
      ...rawEvent,
      eventId: rawEvent.eventId as string ?? uuidv4(),
      projectId: rawEvent.projectId as string ?? '',
      environment: rawEvent.environment as string ?? 'production',
      event: rawEvent.event as string ?? 'unknown',
      sessionId: rawEvent.sessionId as string ?? '',
      timestamp: rawEvent.timestamp as string ?? now,
      serverTimestamp: rawEvent.serverTimestamp as string ?? now,
      sdk: (rawEvent.sdk as EnrichedAnalyticsEvent['sdk']) ?? { name: 'unknown', version: '0.0.0' },
      context: (rawEvent.context as EnrichedAnalyticsEvent['context']) ?? {
        browser: 'unknown',
        browserVersion: '',
        os: 'unknown',
        osVersion: '',
        device: 'desktop' as const,
        screenWidth: 0,
        screenHeight: 0,
        language: 'en',
        timezone: 'UTC',
      },
      geo: (rawEvent.geo as EnrichedAnalyticsEvent['geo']) ?? {
        country: 'Unknown',
        city: 'Unknown',
        region: 'Unknown',
      },
      ipHash: rawEvent.ipHash as string ?? '',
      processingMetadata: {
        ingestedAt: rawEvent.serverTimestamp as string ?? now,
        processedAt: now,
        processingDurationMs: 0,
      },
    };
  }
}
