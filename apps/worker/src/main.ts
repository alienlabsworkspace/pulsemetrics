import { Kafka, Consumer, EachMessagePayload } from 'kafkajs';
import { createClient } from '@clickhouse/client';
import Redis from 'ioredis';
import { TOPICS } from '@pulsemetrics/shared';
import { EventProcessor } from './processors/event-processor';
import { ClickHouseWriter } from './writers/clickhouse-writer';

const REDPANDA_BROKERS = (process.env.REDPANDA_BROKERS ?? 'localhost:9092').split(',');
const REDIS_URL = process.env.REDIS_URL ?? 'redis://localhost:6379';
const CLICKHOUSE_URL = process.env.CLICKHOUSE_URL ?? 'http://localhost:8123';
const CLICKHOUSE_DATABASE = process.env.CLICKHOUSE_DATABASE ?? 'pulsemetrics';

async function main() {
  console.log('🔧 PulseMetrics Worker starting...');

  // ─── Initialize clients ──────────────────────────────────
  const kafka = new Kafka({
    clientId: 'pulsemetrics-worker',
    brokers: REDPANDA_BROKERS,
    retry: { retries: 5 },
  });

  const redis = new Redis(REDIS_URL, {
    maxRetriesPerRequest: 3,
  });

  const clickhouse = createClient({
    url: CLICKHOUSE_URL,
    database: CLICKHOUSE_DATABASE,
  });

  // ─── Initialize services ─────────────────────────────────
  const processor = new EventProcessor();
  const writer = new ClickHouseWriter(clickhouse);

  // ─── Create consumer ─────────────────────────────────────
  const consumer: Consumer = kafka.consumer({
    groupId: 'pulsemetrics-event-processors',
  });

  await consumer.connect();
  console.log('✅ Connected to Redpanda');

  await consumer.subscribe({
    topic: TOPICS.EVENTS_RAW,
    fromBeginning: false,
  });

  // ─── Process messages ────────────────────────────────────
  let batch: unknown[] = [];
  const BATCH_SIZE = 100;
  const FLUSH_INTERVAL_MS = 5000;

  const flushBatch = async () => {
    if (batch.length === 0) return;

    const currentBatch = [...batch];
    batch = [];

    try {
      await writer.writeBatch(currentBatch);
      console.log(`📊 Flushed ${currentBatch.length} events to ClickHouse`);

      // Publish real-time update to Redis
      await redis.publish('realtime:events', JSON.stringify({
        type: 'batch_processed',
        count: currentBatch.length,
        timestamp: new Date().toISOString(),
      }));
    } catch (error) {
      console.error('❌ Failed to flush batch:', error);
      // Re-add to batch for retry
      batch = [...currentBatch, ...batch];
    }
  };

  // Periodic flush
  setInterval(flushBatch, FLUSH_INTERVAL_MS);

  await consumer.run({
    eachMessage: async ({ message }: EachMessagePayload) => {
      try {
        const rawEvent = JSON.parse(message.value?.toString() ?? '{}');
        const processedEvent = processor.process(rawEvent);

        batch.push(processedEvent);

        if (batch.length >= BATCH_SIZE) {
          await flushBatch();
        }
      } catch (error) {
        console.error('❌ Failed to process event:', error);
        // TODO: Send to dead letter queue
      }
    },
  });

  console.log(`🚀 PulseMetrics Worker running — consuming from "${TOPICS.EVENTS_RAW}"`);

  // ─── Graceful shutdown ───────────────────────────────────
  const shutdown = async () => {
    console.log('🛑 Shutting down worker...');
    await flushBatch();
    await consumer.disconnect();
    await redis.quit();
    await clickhouse.close();
    process.exit(0);
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
}

main().catch((error) => {
  console.error('💥 Worker failed to start:', error);
  process.exit(1);
});
