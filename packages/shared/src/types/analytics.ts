// ─── Analytics Query Types ─────────────────────────────────

export type TimeInterval = '1m' | '5m' | '15m' | '1h' | '6h' | '1d' | '7d' | '30d';

export interface AnalyticsQueryParams {
  projectId: string;
  from: string;
  to: string;
  interval?: TimeInterval;
  filters?: AnalyticsFilter[];
}

export interface AnalyticsFilter {
  field: string;
  operator: 'eq' | 'neq' | 'in' | 'contains' | 'gt' | 'lt';
  value: string | string[] | number;
}

// ─── Analytics Response Types ──────────────────────────────

export interface OverviewKPIs {
  totalVisitors: number;
  totalVisitorsChange: number;
  pageViews: number;
  pageViewsChange: number;
  sessions: number;
  sessionsChange: number;
  bounceRate: number;
  bounceRateChange: number;
  avgDuration: number;
  avgDurationChange: number;
  conversionRate: number;
  conversionRateChange: number;
}

export interface TimeSeriesPoint {
  timestamp: string;
  value: number;
}

export interface TimeSeriesData {
  series: {
    name: string;
    data: TimeSeriesPoint[];
  }[];
}

export interface TrafficSource {
  source: string;
  visitors: number;
  percentage: number;
}

export interface GeoData {
  country: string;
  countryCode: string;
  activeUsers: number;
  share: number;
}

export interface DeviceBreakdown {
  device: string;
  percentage: number;
  count: number;
}

export interface BrowserBreakdown {
  browser: string;
  percentage: number;
  count: number;
}

export interface TopPage {
  path: string;
  views: number;
  uniqueVisitors: number;
  avgTime: string;
  bounceRate: number;
}

export interface RealTimeData {
  activeUsers: number;
  activeUsersChange: number;
  eventsPerMinute: number;
  ingestionHealth: number;
  sdkConnections: number;
}
