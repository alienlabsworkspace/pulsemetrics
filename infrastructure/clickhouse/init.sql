-- ClickHouse initialization script for PulseMetrics

CREATE DATABASE IF NOT EXISTS pulsemetrics;

USE pulsemetrics;

-- Main events table
CREATE TABLE IF NOT EXISTS events (
    event_id        UUID,
    project_id      UUID,
    timestamp       DateTime64(3, 'UTC'),
    event_name      LowCardinality(String),
    user_id         String,
    session_id      String,
    page            String,
    referrer        String,
    country         LowCardinality(String),
    city            String,
    region          String,
    device          LowCardinality(String),
    browser         LowCardinality(String),
    browser_version String,
    os              LowCardinality(String),
    os_version      String,
    screen_width    UInt16,
    screen_height   UInt16,
    language        LowCardinality(String),
    ip_hash         String,
    sdk_version     LowCardinality(String),
    environment     LowCardinality(String),
    properties      String,
    duration_ms     UInt32 DEFAULT 0,
    status_code     UInt16 DEFAULT 0,
    ingested_at     DateTime64(3, 'UTC') DEFAULT now64(3),
    processed_at    DateTime64(3, 'UTC') DEFAULT now64(3)
)
ENGINE = MergeTree()
PARTITION BY toYYYYMM(timestamp)
ORDER BY (project_id, timestamp, event_name)
TTL timestamp + INTERVAL 90 DAY
SETTINGS index_granularity = 8192;

-- Materialized view: hourly aggregations
CREATE MATERIALIZED VIEW IF NOT EXISTS events_hourly_mv
ENGINE = SummingMergeTree()
PARTITION BY toYYYYMM(hour)
ORDER BY (project_id, hour, event_name, country, device, browser)
AS SELECT
    project_id,
    toStartOfHour(timestamp) AS hour,
    event_name,
    country,
    device,
    browser,
    count() AS event_count,
    uniqExact(user_id) AS unique_users,
    uniqExact(session_id) AS unique_sessions
FROM events
GROUP BY project_id, hour, event_name, country, device, browser;

-- Materialized view: daily page stats
CREATE MATERIALIZED VIEW IF NOT EXISTS page_stats_daily_mv
ENGINE = SummingMergeTree()
PARTITION BY toYYYYMM(day)
ORDER BY (project_id, day, page)
AS SELECT
    project_id,
    toDate(timestamp) AS day,
    page,
    count() AS views,
    uniqExact(user_id) AS unique_visitors
FROM events
WHERE event_name = 'page_view'
GROUP BY project_id, day, page;
