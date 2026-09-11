// ─── Raw Event from SDK ────────────────────────────────────

export interface RawAnalyticsEvent {
  event: string;
  userId?: string;
  sessionId: string;
  page?: string;
  referrer?: string;
  properties?: Record<string, unknown>;
  timestamp: string;
  sdk: {
    name: string;
    version: string;
  };
  context: {
    browser: string;
    browserVersion: string;
    os: string;
    osVersion: string;
    device: 'desktop' | 'mobile' | 'tablet';
    screenWidth: number;
    screenHeight: number;
    language: string;
    timezone: string;
  };
}

// ─── Enriched Event (after processing) ─────────────────────

export interface EnrichedAnalyticsEvent extends RawAnalyticsEvent {
  eventId: string;
  projectId: string;
  environment: string;
  serverTimestamp: string;
  geo: {
    country: string;
    city: string;
    region: string;
  };
  ipHash: string;
  processingMetadata: {
    ingestedAt: string;
    processedAt: string;
    processingDurationMs: number;
  };
}

// ─── Event Ingestion Request ───────────────────────────────

export interface EventIngestionRequest {
  event: string;
  userId?: string;
  sessionId?: string;
  page?: string;
  referrer?: string;
  properties?: Record<string, unknown>;
}

export interface EventBatchIngestionRequest {
  events: EventIngestionRequest[];
}

// ─── Kafka/Redpanda Message ────────────────────────────────

export interface EventMessage {
  key: string;
  value: EnrichedAnalyticsEvent;
  headers: {
    traceId: string;
    projectId: string;
    environment: string;
    ingestedAt: string;
  };
}
