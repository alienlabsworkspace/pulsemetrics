// ─── Redpanda / Kafka Topics ───────────────────────────────

export const TOPICS = {
  EVENTS_RAW: 'analytics.events.raw',
  EVENTS_PROCESSED: 'analytics.events.processed',
  EVENTS_FAILED: 'analytics.events.failed',
  EVENTS_REALTIME: 'analytics.events.realtime',
} as const;

// ─── API Key Prefixes ──────────────────────────────────────

export const API_KEY_PREFIX = {
  PRODUCTION: 'pk_live_',
  DEVELOPMENT: 'pk_test_',
} as const;

// ─── Rate Limits ───────────────────────────────────────────

export const RATE_LIMITS = {
  EVENTS_PER_MIN: 1000,
  API_PER_MIN: 100,
  AUTH_PER_MIN: 10,
} as const;

// ─── Cache TTLs (seconds) ──────────────────────────────────

export const CACHE_TTL = {
  API_KEY: 300,          // 5 minutes
  ANALYTICS_REALTIME: 5, // 5 seconds
  ANALYTICS_SHORT: 30,   // 30 seconds
  ANALYTICS_MEDIUM: 300, // 5 minutes
  SESSION: 1800,         // 30 minutes
} as const;

// ─── Pagination Defaults ───────────────────────────────────

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
} as const;

// ─── Event Constraints ─────────────────────────────────────

export const EVENT_CONSTRAINTS = {
  MAX_EVENT_NAME_LENGTH: 255,
  MAX_PROPERTY_KEY_LENGTH: 100,
  MAX_PROPERTY_VALUE_LENGTH: 1000,
  MAX_PROPERTIES_COUNT: 50,
  MAX_PAYLOAD_SIZE_BYTES: 65536, // 64KB
  MAX_BATCH_SIZE: 100,
} as const;

// ─── Component Names (Pipeline Health) ─────────────────────

export const PIPELINE_COMPONENTS = [
  'api_gateway',
  'event_queue',
  'workers',
  'aggregation',
  'redis_cache',
  'analytics_db',
] as const;

export type PipelineComponent = (typeof PIPELINE_COMPONENTS)[number];
