export interface PulseMetricsConfig {
  /** API key (e.g., pk_live_xxxxx) */
  apiKey: string;
  /** API endpoint URL (defaults to /api/v1/events) */
  endpoint?: string;
  /** Enable debug logging */
  debug?: boolean;
  /** Auto-track page views */
  autoTrack?: boolean;
  /** Batch size before flush */
  batchSize?: number;
  /** Flush interval in milliseconds */
  flushInterval?: number;
}

export interface TrackOptions {
  /** Custom properties */
  [key: string]: unknown;
}

export interface IdentifyTraits {
  email?: string;
  name?: string;
  [key: string]: unknown;
}

export interface AnalyticsEvent {
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
