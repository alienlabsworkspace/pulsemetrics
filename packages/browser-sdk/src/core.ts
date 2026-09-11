import type { PulseMetricsConfig, TrackOptions, IdentifyTraits, AnalyticsEvent } from './types';
import { getSessionId } from './session';
import { detectContext } from './context';
import { Transport } from './transport';

const SDK_NAME = '@pulsemetrics/browser';
const SDK_VERSION = '0.1.0';

export class PulseMetrics {
  private config: Required<PulseMetricsConfig>;
  private userId?: string;
  private traits: Record<string, unknown> = {};
  private transport: Transport;
  private sessionId: string;

  constructor(config: PulseMetricsConfig) {
    this.config = {
      apiKey: config.apiKey,
      endpoint: config.endpoint ?? '/api/v1/events',
      debug: config.debug ?? false,
      autoTrack: config.autoTrack ?? true,
      batchSize: config.batchSize ?? 10,
      flushInterval: config.flushInterval ?? 5000,
    };

    this.sessionId = getSessionId();
    this.transport = new Transport(this.config.endpoint, this.config.apiKey, {
      batchSize: this.config.batchSize,
      flushInterval: this.config.flushInterval,
    });

    if (this.config.autoTrack) {
      this.setupAutoTracking();
    }

    this.log('PulseMetrics initialized', { apiKey: this.config.apiKey.slice(0, 12) + '...' });
  }

  /** Track a custom event */
  track(eventName: string, properties?: TrackOptions): void {
    const event = this.buildEvent(eventName, properties);
    this.transport.enqueue(event);
    this.log('Track:', eventName, properties);
  }

  /** Identify a user */
  identify(userId: string, traits?: IdentifyTraits): void {
    this.userId = userId;
    this.traits = { ...this.traits, ...traits };
    this.track('identify', { userId, ...traits });
    this.log('Identify:', userId, traits);
  }

  /** Track a page view */
  page(properties?: TrackOptions): void {
    this.track('page_view', {
      path: window.location.pathname,
      title: document.title,
      url: window.location.href,
      ...properties,
    });
  }

  /** Flush all queued events immediately */
  async flush(): Promise<void> {
    await this.transport.flush();
  }

  /** Shutdown the SDK */
  async shutdown(): Promise<void> {
    await this.flush();
    this.transport.destroy();
  }

  private buildEvent(eventName: string, properties?: Record<string, unknown>): AnalyticsEvent {
    const context = detectContext();
    return {
      event: eventName,
      userId: this.userId,
      sessionId: this.sessionId,
      page: typeof window !== 'undefined' ? window.location.pathname : undefined,
      referrer: typeof document !== 'undefined' ? document.referrer : undefined,
      properties: { ...this.traits, ...properties },
      timestamp: new Date().toISOString(),
      sdk: {
        name: SDK_NAME,
        version: SDK_VERSION,
      },
      context,
    };
  }

  private setupAutoTracking(): void {
    if (typeof window === 'undefined') return;

    // Track initial page view
    this.page();

    // Track navigation changes (SPA support)
    const originalPushState = history.pushState;
    history.pushState = (...args) => {
      originalPushState.apply(history, args);
      this.page();
    };

    window.addEventListener('popstate', () => {
      this.page();
    });
  }

  private log(...args: unknown[]): void {
    if (this.config.debug) {
      console.log('[PulseMetrics]', ...args);
    }
  }
}
