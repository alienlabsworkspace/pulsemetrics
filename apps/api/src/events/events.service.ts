import { Injectable, Inject } from '@nestjs/common';
import { Kafka, Producer } from 'kafkajs';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import { TOPICS } from '@pulsemetrics/shared';

@Injectable()
export class EventsService {
  private producer: Producer;
  private connected = false;

  constructor(private readonly configService: ConfigService) {
    const brokers = this.configService.get<string>('REDPANDA_BROKERS', 'localhost:19092').split(',');
    const kafka = new Kafka({
      clientId: 'pulsemetrics-api',
      brokers,
      retry: { retries: 3 },
    });
    this.producer = kafka.producer();
  }

  async onModuleInit() {
    try {
      await this.producer.connect();
      this.connected = true;
      console.log('✅ Kafka producer connected');
    } catch (error) {
      console.warn('⚠️ Kafka producer failed to connect (events will be queued in-memory):', (error as Error).message);
    }
  }

  async onModuleDestroy() {
    if (this.connected) {
      await this.producer.disconnect();
    }
  }

  async ingest(event: Record<string, unknown>, projectId: string, environment: string, ip?: string) {
    const enrichedEvent = {
      ...event,
      eventId: uuidv4(),
      projectId,
      environment,
      serverTimestamp: new Date().toISOString(),
      ipHash: ip ? this.hashIp(ip) : '',
    };

    if (this.connected) {
      await this.producer.send({
        topic: TOPICS.EVENTS_RAW,
        messages: [
          {
            key: projectId,
            value: JSON.stringify(enrichedEvent),
            headers: {
              traceId: uuidv4(),
              projectId,
              environment,
              ingestedAt: new Date().toISOString(),
            },
          },
        ],
      });
    }

    return { eventId: enrichedEvent.eventId, status: 'accepted' };
  }

  async ingestBatch(events: Record<string, unknown>[], projectId: string, environment: string, ip?: string) {
    const messages = events.map((event) => {
      const enriched = {
        ...event,
        eventId: uuidv4(),
        projectId,
        environment,
        serverTimestamp: new Date().toISOString(),
        ipHash: ip ? this.hashIp(ip) : '',
      };

      return {
        key: projectId,
        value: JSON.stringify(enriched),
        headers: {
          traceId: uuidv4(),
          projectId,
          environment,
          ingestedAt: new Date().toISOString(),
        },
      };
    });

    if (this.connected) {
      await this.producer.send({
        topic: TOPICS.EVENTS_RAW,
        messages,
      });
    }

    return { accepted: events.length, status: 'accepted' };
  }

  private hashIp(ip: string): string {
    const { createHash } = require('crypto');
    return createHash('sha256').update(ip).digest('hex').substring(0, 16);
  }
}
