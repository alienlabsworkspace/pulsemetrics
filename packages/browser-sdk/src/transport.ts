import type { AnalyticsEvent } from './types';

interface TransportOptions {
  batchSize: number;
  flushInterval: number;
}

export class Transport {
  private queue: AnalyticsEvent[] = [];
  private timer: ReturnType<typeof setInterval> | null = null;

  constructor(
    private endpoint: string,
    private apiKey: string,
    private options: TransportOptions,
  ) {
    this.timer = setInterval(() => this.flush(), this.options.flushInterval);

    // Flush on page unload
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', () => this.flush());
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') this.flush();
      });
    }
  }

  enqueue(event: AnalyticsEvent): void {
    this.queue.push(event);
    if (this.queue.length >= this.options.batchSize) {
      this.flush();
    }
  }

  async flush(): Promise<void> {
    if (this.queue.length === 0) return;

    const batch = [...this.queue];
    this.queue = [];

    try {
      const url = batch.length === 1 ? this.endpoint : `${this.endpoint}/batch`;
      const body = batch.length === 1
        ? JSON.stringify(batch[0])
        : JSON.stringify({ events: batch });

      // Use sendBeacon for page unload, fetch otherwise
      if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
        const blob = new Blob([body], { type: 'application/json' });
        const sent = navigator.sendBeacon(url + `?key=${this.apiKey}`, blob);
        if (!sent) {
          await this.fetchSend(url, body);
        }
      } else {
        await this.fetchSend(url, body);
      }
    } catch {
      // Re-enqueue on failure (best effort)
      this.queue = [...batch, ...this.queue];
    }
  }

  destroy(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  private async fetchSend(url: string, body: string): Promise<void> {
    await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': this.apiKey,
      },
      body,
      keepalive: true,
    });
  }
}
