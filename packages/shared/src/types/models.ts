// ─── User & Organization Types ─────────────────────────────

export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  plan: 'free' | 'pro' | 'enterprise';
  createdAt: string;
  updatedAt: string;
}

export type MemberRole = 'owner' | 'admin' | 'member' | 'viewer';

export interface OrganizationMember {
  id: string;
  organizationId: string;
  userId: string;
  role: MemberRole;
  joinedAt: string;
  user?: User;
}

// ─── Project Types ─────────────────────────────────────────

export type ProjectStatus = 'active' | 'archived' | 'paused';
export type ProjectEnvironment = 'production' | 'development';

export interface Project {
  id: string;
  organizationId: string;
  name: string;
  slug: string;
  description?: string;
  status: ProjectStatus;
  environment: ProjectEnvironment;
  settings: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

// ─── API Key Types ─────────────────────────────────────────

export interface ApiKey {
  id: string;
  projectId: string;
  name: string;
  keyPrefix: string;
  environment: ProjectEnvironment;
  lastUsedAt?: string;
  expiresAt?: string;
  revokedAt?: string;
  createdAt: string;
}

export interface ApiKeyWithSecret extends ApiKey {
  /** Full key — only available at creation time */
  fullKey: string;
}

// ─── Alert Types ───────────────────────────────────────────

export type AlertSeverity = 'info' | 'warning' | 'critical';
export type AlertStatus = 'triggered' | 'resolved' | 'acknowledged';
export type AlertConditionType =
  | 'error_rate'
  | 'low_ingestion'
  | 'traffic_spike'
  | 'traffic_drop'
  | 'high_latency'
  | 'pipeline_failure';

export interface AlertRule {
  id: string;
  projectId: string;
  name: string;
  conditionType: AlertConditionType;
  threshold: number;
  durationSeconds: number;
  severity: AlertSeverity;
  enabled: boolean;
  channels: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Alert {
  id: string;
  alertRuleId: string;
  projectId: string;
  status: AlertStatus;
  triggeredAt: string;
  resolvedAt?: string;
  metadata: Record<string, unknown>;
  createdAt: string;
}
