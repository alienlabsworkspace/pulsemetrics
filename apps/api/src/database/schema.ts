import { pgTable, uuid, varchar, text, timestamp, boolean, decimal, integer, jsonb, inet, uniqueIndex, index } from 'drizzle-orm/pg-core';

// ─── Users ─────────────────────────────────────────────────

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  avatarUrl: varchar('avatar_url', { length: 512 }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// ─── Organizations ─────────────────────────────────────────

export const organizations = pgTable('organizations', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).unique().notNull(),
  plan: varchar('plan', { length: 50 }).default('free').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// ─── Organization Members ──────────────────────────────────

export const organizationMembers = pgTable('organization_members', {
  id: uuid('id').defaultRandom().primaryKey(),
  organizationId: uuid('organization_id').references(() => organizations.id, { onDelete: 'cascade' }).notNull(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  role: varchar('role', { length: 50 }).default('member').notNull(),
  joinedAt: timestamp('joined_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  uniqueIndex('org_member_unique').on(table.organizationId, table.userId),
  index('idx_org_members_org').on(table.organizationId),
  index('idx_org_members_user').on(table.userId),
]);

// ─── Projects ──────────────────────────────────────────────

export const projects = pgTable('projects', {
  id: uuid('id').defaultRandom().primaryKey(),
  organizationId: uuid('organization_id').references(() => organizations.id, { onDelete: 'cascade' }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull(),
  description: text('description'),
  status: varchar('status', { length: 50 }).default('active').notNull(),
  environment: varchar('environment', { length: 50 }).default('production').notNull(),
  settings: jsonb('settings').default({}).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  uniqueIndex('project_org_slug_unique').on(table.organizationId, table.slug),
  index('idx_projects_org').on(table.organizationId),
]);

// ─── API Keys ──────────────────────────────────────────────

export const apiKeys = pgTable('api_keys', {
  id: uuid('id').defaultRandom().primaryKey(),
  projectId: uuid('project_id').references(() => projects.id, { onDelete: 'cascade' }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  keyPrefix: varchar('key_prefix', { length: 20 }).notNull(),
  keyHash: varchar('key_hash', { length: 255 }).notNull(),
  environment: varchar('environment', { length: 50 }).notNull(),
  lastUsedAt: timestamp('last_used_at', { withTimezone: true }),
  expiresAt: timestamp('expires_at', { withTimezone: true }),
  revokedAt: timestamp('revoked_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index('idx_api_keys_project').on(table.projectId),
  index('idx_api_keys_prefix').on(table.keyPrefix),
]);

// ─── Alert Rules ───────────────────────────────────────────

export const alertRules = pgTable('alert_rules', {
  id: uuid('id').defaultRandom().primaryKey(),
  projectId: uuid('project_id').references(() => projects.id, { onDelete: 'cascade' }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  conditionType: varchar('condition_type', { length: 100 }).notNull(),
  threshold: decimal('threshold').notNull(),
  durationSeconds: integer('duration_seconds').notNull(),
  severity: varchar('severity', { length: 50 }).default('warning').notNull(),
  enabled: boolean('enabled').default(true).notNull(),
  channels: jsonb('channels').default([]).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// ─── Alerts ────────────────────────────────────────────────

export const alerts = pgTable('alerts', {
  id: uuid('id').defaultRandom().primaryKey(),
  alertRuleId: uuid('alert_rule_id').references(() => alertRules.id, { onDelete: 'cascade' }).notNull(),
  projectId: uuid('project_id').references(() => projects.id, { onDelete: 'cascade' }).notNull(),
  status: varchar('status', { length: 50 }).notNull(),
  triggeredAt: timestamp('triggered_at', { withTimezone: true }).notNull(),
  resolvedAt: timestamp('resolved_at', { withTimezone: true }),
  metadata: jsonb('metadata').default({}).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index('idx_alerts_project').on(table.projectId),
]);

// ─── Audit Logs ────────────────────────────────────────────

export const auditLogs = pgTable('audit_logs', {
  id: uuid('id').defaultRandom().primaryKey(),
  organizationId: uuid('organization_id').references(() => organizations.id, { onDelete: 'cascade' }).notNull(),
  userId: uuid('user_id').references(() => users.id),
  action: varchar('action', { length: 255 }).notNull(),
  resourceType: varchar('resource_type', { length: 100 }).notNull(),
  resourceId: uuid('resource_id'),
  metadata: jsonb('metadata').default({}).notNull(),
  ipAddress: inet('ip_address'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index('idx_audit_logs_org').on(table.organizationId),
  index('idx_audit_logs_created').on(table.createdAt),
]);
