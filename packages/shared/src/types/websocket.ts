// ─── WebSocket Event Types ─────────────────────────────────

// Client → Server
export interface WsSubscribe {
  type: 'subscribe';
  channel: 'realtime' | 'alerts' | 'pipeline';
  projectId: string;
}

export interface WsUnsubscribe {
  type: 'unsubscribe';
  channel: string;
}

export type WsClientMessage = WsSubscribe | WsUnsubscribe;

// Server → Client
export interface WsRealtimeUpdate {
  type: 'realtime.update';
  data: {
    activeUsers: number;
    eventsPerMinute: number;
    ingestionHealth: number;
  };
}

export interface WsNewEvent {
  type: 'event.new';
  data: {
    eventId: string;
    eventName: string;
    userId: string;
    sessionId: string;
    page: string;
    country: string;
    device: string;
    browser: string;
    timestamp: string;
  };
}

export interface WsAlertTriggered {
  type: 'alert.triggered';
  data: {
    alertId: string;
    ruleName: string;
    severity: string;
    message: string;
    triggeredAt: string;
  };
}

export interface WsPipelineStatus {
  type: 'pipeline.status';
  data: {
    component: string;
    status: 'healthy' | 'degraded' | 'critical';
    latency: number;
    throughput: number;
    errorRate: number;
    lastChecked: string;
  };
}

export type WsServerMessage =
  | WsRealtimeUpdate
  | WsNewEvent
  | WsAlertTriggered
  | WsPipelineStatus;
