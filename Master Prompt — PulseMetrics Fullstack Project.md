# PULSEMETRICS — PRODUCTION-GRADE REAL-TIME ANALYTICS PLATFORM

## ROLE

Act as a **Senior Fullstack Engineer, Backend Engineer, Distributed Systems Engineer, and Software Architect**.

You are responsible for designing and implementing a production-grade fullstack application called **PulseMetrics**.

This project is intended to be a serious **Fullstack/Backend Developer portfolio project**, not a simple CRUD dashboard.

The final system should demonstrate strong engineering skills in:

- Modern frontend architecture
- Backend architecture
- REST API design
- WebSocket real-time communication
- Event-driven architecture
- Distributed systems
- Event streaming
- Analytics databases
- Caching
- Background processing
- Authentication and authorization
- Multi-tenancy
- API key management
- Browser SDK development
- Observability
- Testing
- Docker
- CI/CD
- Cloud-ready architecture

Do not create a fake-looking dashboard with hardcoded data.

The system must actually work end-to-end.

---

# 1. PRODUCT OVERVIEW

Build a SaaS platform called:

**PulseMetrics**

Tagline:

> Real-Time Analytics & Event Intelligence Platform

PulseMetrics allows users to create analytics projects and collect application/web events through an SDK.

The platform processes events through an event-driven pipeline and provides real-time analytics through an interactive dashboard.

High-level architecture:

```text
                    ┌──────────────────────────┐
                    │       Next.js App        │
                    │   Analytics Dashboard    │
                    └────────────┬─────────────┘
                                 │
                         REST / WebSocket
                                 │
                    ┌────────────▼─────────────┐
                    │       NestJS API         │
                    │      API Gateway         │
                    └───────┬─────────┬─────────┘
                            │         │
                    ┌───────▼───┐ ┌──▼─────────┐
                    │   Redis   │ │ PostgreSQL │
                    │   Cache   │ │ Core Data  │
                    └───────────┘ └────────────┘

Browser / SDK
      │
      │ Analytics Events
      ▼
┌─────────────────────┐
│   Event Ingestion   │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Redpanda / Kafka    │
│    Event Stream     │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Background Workers  │
│   Event Processing  │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│     ClickHouse      │
│   Analytics Data    │
└──────────┬──────────┘
           │
           ▼
      Analytics API
           │
           ▼
    Next.js Dashboard
```

---

# 2. CORE TECHNOLOGY STACK

Use the following stack unless there is a strong technical reason to change something.

## Frontend

- Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui
- TanStack Query
- Zustand
- Apache ECharts

Frontend responsibilities:

- Authentication UI
- Dashboard
- Analytics visualization
- Real-time monitoring
- Event explorer
- Project management
- API key management
- SDK documentation
- Alerts
- Settings
- Billing UI

---

# 3. BACKEND

Use:

- NestJS
- TypeScript
- REST API
- WebSocket

Backend should use modular architecture.

Suggested structure:

```text
backend/
├── src/
│   ├── auth/
│   ├── users/
│   ├── organizations/
│   ├── projects/
│   ├── api-keys/
│   ├── events/
│   ├── analytics/
│   ├── alerts/
│   ├── realtime/
│   ├── billing/
│   ├── health/
│   └── common/
```

Follow:

- SOLID principles
- Clean architecture where appropriate
- Dependency injection
- DTO validation
- Error handling
- Logging
- Separation of concerns

Do not put business logic directly inside controllers.

---

# 4. DATABASE ARCHITECTURE

Use two primary databases.

## PostgreSQL

Use PostgreSQL for application/core data:

```text
users
organizations
organization_members
projects
api_keys
subscriptions
alerts
alert_rules
dashboards
audit_logs
```

Use:

**Drizzle ORM**

for PostgreSQL.

---

## ClickHouse

Use ClickHouse for high-volume analytics events.

Example event schema:

```text
event_id
project_id
timestamp
event_name
user_id
session_id
page
country
city
device
browser
os
referrer
properties
```

The analytics database should be optimized for:

- time-series queries
- aggregation
- filtering
- grouping
- large event volumes

Do not use PostgreSQL for high-volume analytics queries if ClickHouse is appropriate.

---

# 5. REDPANDA / KAFKA

Use:

**Redpanda**

for local development and event streaming.

Keep the architecture Kafka-compatible.

Event flow:

```text
SDK
 ↓
NestJS Event Ingestion
 ↓
Redpanda
 ↓
Worker
 ↓
ClickHouse
```

Create appropriate topics.

For example:

```text
analytics.events
analytics.events.processed
analytics.events.failed
```

Implement proper producer and consumer logic.

---

# 6. BACKGROUND WORKERS

Create worker services responsible for processing events asynchronously.

Example:

```text
Worker
├── consume event
├── validate event
├── enrich event
├── normalize event
├── write to ClickHouse
├── publish real-time update
└── record processing metrics
```

Workers must not block the API request unnecessarily.

The ingestion API should acknowledge valid events quickly and let asynchronous processing handle the heavy work.

---

# 7. REDIS

Use Redis for:

- caching
- rate limiting
- temporary counters
- real-time coordination
- session-related functionality where appropriate

Example:

```text
Dashboard Query
      ↓
Redis Cache
      ↓
Cache Miss
      ↓
ClickHouse
      ↓
Redis
      ↓
Dashboard
```

Implement sensible TTL values.

Avoid blindly caching everything.

---

# 8. REAL-TIME SYSTEM

PulseMetrics must provide real-time analytics.

Use:

**WebSocket**

for dashboard updates.

Example:

```text
New Event
   ↓
Redpanda
   ↓
Worker
   ↓
Redis / Event Bus
   ↓
WebSocket Gateway
   ↓
Browser Dashboard
```

The dashboard should be able to update:

- Active users
- Events per minute
- Recent events
- Event counters
- System health

without manually refreshing the page.

---

# 9. BROWSER ANALYTICS SDK

Create a separate package:

```text
@pulsemetrics/browser
```

The SDK should provide an API similar to:

```typescript
import { PulseMetrics } from "@pulsemetrics/browser";

const analytics = new PulseMetrics({
  apiKey: "pk_live_xxxxx",
});

analytics.track("page_view");

analytics.track("button_click", {
  button: "checkout",
});
```

Implement at minimum:

```text
track()
identify()
page()
```

The SDK should collect reasonable metadata such as:

- page URL
- referrer
- browser
- OS
- device
- timestamp
- session ID

Do not collect sensitive personal information unnecessarily.

The SDK should be lightweight and production-oriented.

---

# 10. AUTHENTICATION

Implement secure authentication.

Requirements:

- Registration
- Login
- Logout
- Session management
- Password hashing
- Protected routes
- Authentication guards
- Email/account management

Use a secure authentication approach appropriate for Next.js + NestJS.

Never store plaintext passwords.

---

# 11. MULTI-TENANCY

PulseMetrics must support organizations/workspaces.

Architecture:

```text
User
 ↓
Organization
 ↓
Projects
 ↓
API Keys
 ↓
Analytics Events
```

A user can belong to multiple organizations.

Implement roles:

```text
Owner
Admin
Member
Viewer
```

Use RBAC.

Users must only be able to access resources belonging to organizations they are authorized to access.

This is an important security requirement.

---

# 12. API KEY SYSTEM

Each analytics project should have API keys.

Example:

```text
pk_live_xxxxxxxxx
pk_test_xxxxxxxxx
```

Requirements:

- Create key
- Revoke key
- Rotate key
- Show key prefix
- Never expose secret after initial creation
- Store hashed secret where appropriate
- Associate key with project
- Environment support

Support:

```text
Development
Production
```

---

# 13. EVENT INGESTION API

Create an endpoint such as:

```text
POST /api/v1/events
```

Example payload:

```json
{
  "event": "page_view",
  "userId": "user_123",
  "sessionId": "session_456",
  "page": "/pricing",
  "properties": {
    "plan": "pro"
  }
}
```

The API should:

1. Validate API key
2. Validate payload
3. Apply rate limiting
4. Add server metadata
5. Publish event to Redpanda
6. Return quickly

Do not synchronously perform expensive analytics processing inside the request.

---

# 14. ANALYTICS FEATURES

Implement analytics such as:

### Overview

- Total Visitors
- Page Views
- Sessions
- Bounce Rate
- Average Session Duration
- Conversion Rate
- Active Users

### Traffic

- Visitors over time
- Sessions over time
- Page views over time
- Traffic sources
- Referrers

### Geography

- Country
- City
- Region

### Technology

- Device
- Browser
- Operating System

### Content

- Top pages
- Landing pages
- Exit pages

### Events

- Event volume
- Event frequency
- Event trends
- Event properties

---

# 15. EVENTS EXPLORER

Create an Events Explorer page.

Features:

- Search
- Time range
- Event type filter
- User filter
- Country filter
- Device filter
- Browser filter
- Pagination
- Sorting

Table:

```text
Timestamp
Event
User
Session
Location
Device
Browser
Page
Properties
```

Clicking an event should open an event detail panel.

---

# 16. PROJECT MANAGEMENT

Users should be able to:

- Create project
- Edit project
- Delete project
- Archive project
- Select environment
- View project statistics

Project card should display:

```text
Project Name
Environment
Events
Active Users
Health
SDK Version
Last Event
```

---

# 17. ALERTING SYSTEM

Implement configurable alerts.

Examples:

```text
High Error Rate
Low Event Ingestion
Traffic Spike
Traffic Drop
High API Latency
Pipeline Failure
```

Example rule:

```text
IF error_rate > 5%
FOR 5 minutes
THEN trigger alert
```

Alert states:

```text
Healthy
Warning
Triggered
Resolved
```

---

# 18. SYSTEM HEALTH

Create a system health dashboard.

Display:

```text
API Gateway
Event Queue
Workers
Aggregation
Redis
ClickHouse
Database
WebSocket
```

Each component should display:

- Status
- Latency
- Throughput
- Error rate
- Last health check

Example:

```text
API Gateway
Healthy
12 ms latency

Event Queue
Healthy
18,421 events/min

Workers
Healthy
24/24 active
```

These should be based on real application metrics where possible.

Do not simply hardcode "Healthy".

---

# 19. OBSERVABILITY

Implement:

## Prometheus

Track metrics such as:

```text
HTTP requests
HTTP errors
Request latency
Event ingestion rate
Event processing rate
Kafka/Redpanda consumer lag
Worker processing time
ClickHouse query latency
WebSocket connections
Redis operations
```

## Grafana

Provide dashboards for infrastructure monitoring.

## OpenTelemetry

Add distributed tracing where practical:

```text
HTTP Request
 ↓
NestJS
 ↓
Redpanda
 ↓
Worker
 ↓
ClickHouse
```

Use trace IDs to understand request flow.

---

# 20. FRONTEND PAGES

Build the following pages.

### 1. Dashboard

Route:

```text
/dashboard
```

Include:

- KPI cards
- Visitors chart
- Page views chart
- Real-time users
- Traffic sources
- Top pages
- Device distribution
- Browser distribution

---

### 2. Real-Time Monitoring

Route:

```text
/realtime
```

Include:

- Active users
- Events/min
- Ingestion success
- Live event stream
- Events/min chart
- Filters

Live events should actually arrive through WebSocket.

---

### 3. Event Pipeline

Route:

```text
/monitoring/pipeline
```

Show:

```text
Browser SDK
 ↓
API Gateway
 ↓
Event Ingestion
 ↓
Redpanda
 ↓
Workers
 ↓
Aggregation
 ↓
Redis
 ↓
ClickHouse
 ↓
Dashboard
```

Display health and latency for each component.

---

### 4. Events Explorer

Route:

```text
/events
```

---

### 5. Projects

Route:

```text
/projects
```

---

### 6. Project Detail

Route:

```text
/projects/[projectId]
```

Tabs:

```text
Overview
Analytics
Events
Users
SDK
API Keys
Webhooks
```

---

### 7. SDK / Developer

Route:

```text
/developer/sdk
```

Include installation instructions and code examples.

---

### 8. API Keys

Route:

```text
/developer/api-keys
```

---

### 9. Alerts

Route:

```text
/alerts
```

---

### 10. Settings / Billing

Routes:

```text
/settings
/billing
```

---

# 21. UI / UX DIRECTION

The UI should follow a premium developer-tool aesthetic inspired by products such as:

- Vercel
- Linear
- Stripe Dashboard
- Grafana
- Datadog

But do not directly copy their designs.

Use:

- Clean typography
- Spacious layouts
- Strong information hierarchy
- Dark sidebar
- Light main content
- Subtle borders
- Minimal shadows
- Blue/indigo primary accent
- Green = healthy
- Orange = warning
- Red = critical

The dashboard should look like a real SaaS analytics product.

Avoid:

- Generic Bootstrap-looking UI
- Excessive gradients
- Excessive glassmorphism
- Huge decorative elements
- Fake charts
- Excessive animations

Focus on usability and information density.

---

# 22. RESPONSIVE DESIGN

The application must support:

```text
Desktop
Tablet
Mobile
```

Dashboard charts should resize correctly.

Tables should have responsive behavior.

Sidebar should collapse appropriately.

---

# 23. TESTING

Implement testing from the beginning.

Use:

### Unit tests

Vitest.

Test:

- services
- validation
- analytics calculations
- event processing
- authentication logic

### Integration tests

Test:

```text
API
 ↓
Redpanda
 ↓
Worker
 ↓
ClickHouse
```

where practical.

### E2E

Use Playwright.

Create at least one complete scenario:

```text
Register
 ↓
Login
 ↓
Create Organization
 ↓
Create Project
 ↓
Generate API Key
 ↓
Send Analytics Event
 ↓
Event enters pipeline
 ↓
Worker processes event
 ↓
Event stored in ClickHouse
 ↓
Dashboard displays event
 ↓
Real-time dashboard updates
```

---

# 24. DOCKER

Create Dockerfiles and Docker Compose configuration.

Local infrastructure should be runnable using:

```bash
docker compose up
```

Services should include where appropriate:

```text
frontend
backend
worker
postgres
redis
redpanda
clickhouse
prometheus
grafana
```

Use health checks.

Use environment variables.

Never hardcode secrets.

---

# 25. ENVIRONMENT CONFIGURATION

Create:

```text
.env.example
```

Never commit:

```text
.env
```

Document required variables.

Example:

```text
DATABASE_URL=
REDIS_URL=
CLICKHOUSE_URL=
REDPANDA_BROKERS=
JWT_SECRET=
```

---

# 26. API DOCUMENTATION

Use OpenAPI / Swagger for the NestJS API.

Document:

- authentication
- projects
- API keys
- events
- analytics
- alerts

Provide example requests and responses.

---

# 27. CI/CD

Create GitHub Actions.

Pipeline:

```text
Pull Request
 ↓
Lint
 ↓
Type Check
 ↓
Unit Tests
 ↓
Integration Tests
 ↓
Build
 ↓
E2E
```

Do not deploy code that fails tests.

---

# 28. CODE QUALITY

Follow these principles:

- TypeScript strict mode
- No unnecessary `any`
- Strong typing
- Clear naming
- Small reusable functions
- Separation of concerns
- Consistent error handling
- Input validation
- Secure defaults
- Meaningful comments only
- Avoid premature abstraction

Do not create unnecessary microservices simply to make the architecture look complicated.

Only separate services where there is a real architectural reason.

---

# 29. SECURITY

Pay particular attention to:

- Authentication
- Authorization
- RBAC
- API key security
- Password hashing
- Rate limiting
- Input validation
- SQL injection prevention
- XSS prevention
- CSRF considerations
- CORS
- Secure headers
- Secret management
- Tenant isolation

Never expose API key secrets after creation.

Never log sensitive credentials.

---

# 30. PERFORMANCE

Design the system to handle increasing event volume.

Consider:

- Batch writes to ClickHouse
- Redis caching
- Database indexes
- Pagination
- Query optimization
- Async processing
- Kafka/Redpanda partitioning
- Worker concurrency
- Backpressure
- Rate limiting

Do not optimize blindly.

Measure performance where possible.

---

# 31. SEED DATA

Provide realistic seed data.

The dashboard should look meaningful immediately after setup.

Generate realistic:

```text
Users
Projects
Events
Countries
Devices
Browsers
Pages
Traffic sources
```

However, clearly separate:

```text
Development seed data
```

from real production data.

---

# 32. PROJECT STRUCTURE

Prefer a monorepo.

Suggested structure:

```text
pulsemetrics/
│
├── apps/
│   ├── web/
│   ├── api/
│   └── worker/
│
├── packages/
│   ├── browser-sdk/
│   ├── shared/
│   ├── config/
│   └── ui/
│
├── infrastructure/
│   ├── docker/
│   ├── prometheus/
│   └── grafana/
│
├── docs/
│
├── docker-compose.yml
├── package.json
├── pnpm-workspace.yaml
├── README.md
└── .env.example
```

Use **pnpm workspaces**.

If you determine that another monorepo structure is significantly better, explain why before changing it.

---

# 33. DEVELOPMENT STRATEGY

IMPORTANT:

Do NOT attempt to generate the entire project blindly in one giant response.

Build the system incrementally.

Use the following phases.

## PHASE 1 — Architecture

First:

1. Analyze the requirements.
2. Define architecture.
3. Define database schemas.
4. Define service boundaries.
5. Define API contracts.
6. Define event schema.
7. Define repository structure.
8. Define Docker architecture.

Do not start writing large amounts of implementation code until the architecture is clear.

---

## PHASE 2 — Project Bootstrap

Implement:

- monorepo
- pnpm
- Next.js
- NestJS
- shared packages
- ESLint
- Prettier
- TypeScript
- environment configuration
- Docker Compose

Ensure everything starts successfully.

---

## PHASE 3 — Authentication + Multi-Tenancy

Implement:

- registration
- login
- sessions
- organizations
- members
- roles
- RBAC

Write tests.

---

## PHASE 4 — Projects + API Keys

Implement:

- project CRUD
- API key generation
- API key rotation
- API key revocation
- environments

Write tests.

---

## PHASE 5 — Event Ingestion

Implement:

```text
POST /api/v1/events
```

Then:

```text
API
 ↓
Redpanda
```

Make the pipeline actually work.

---

## PHASE 6 — Worker + ClickHouse

Implement:

```text
Redpanda
 ↓
Worker
 ↓
ClickHouse
```

Test the complete pipeline.

---

## PHASE 7 — Analytics API

Implement endpoints for:

- overview
- visitors
- sessions
- page views
- event volume
- traffic sources
- devices
- browsers
- geography
- top pages

Optimize ClickHouse queries.

---

## PHASE 8 — Frontend Dashboard

Build the UI.

Connect it to real APIs.

Do not use hardcoded metrics.

---

## PHASE 9 — Real-Time System

Implement:

```text
Event
 ↓
Redpanda
 ↓
Worker
 ↓
WebSocket
 ↓
Dashboard
```

Verify real-time updates.

---

## PHASE 10 — SDK

Build:

```text
@pulsemetrics/browser
```

Test it against the actual ingestion API.

---

## PHASE 11 — Monitoring

Add:

- Prometheus
- Grafana
- OpenTelemetry
- health checks
- metrics

---

## PHASE 12 — Alerts

Implement the alert engine.

---

## PHASE 13 — Testing + Hardening

Run:

- unit tests
- integration tests
- E2E tests
- load tests
- security review
- performance review

Fix issues.

---

## PHASE 14 — Documentation

Create an excellent README.

The README should include:

```text
Project Overview
Features
Architecture
Architecture Diagram
Tech Stack
Folder Structure
Database Design
Event Pipeline
Local Development
Environment Variables
Docker Setup
API Documentation
SDK Usage
Testing
Observability
Deployment
Future Improvements
```

---

# 34. IMPORTANT IMPLEMENTATION RULES

### Rule 1

Never use fake backend responses when a real implementation is expected.

### Rule 2

Do not hide architectural problems with unnecessary abstractions.

### Rule 3

Do not create microservices just for the sake of saying "microservices".

### Rule 4

Prefer working incremental implementations.

### Rule 5

After each major phase, verify that the application builds and tests pass.

### Rule 6

When an implementation decision has meaningful trade-offs, explain the trade-off briefly.

### Rule 7

If a technology becomes unnecessary, explain why before removing it.

### Rule 8

Keep the application runnable throughout development.

### Rule 9

Use realistic seed data but never pretend seed data is real production data.

### Rule 10

Prioritize correctness, maintainability, security, and observability over adding random features.

---

# 35. DEFINITION OF DONE

The project is considered complete when I can:

```text
1. Start the infrastructure
       ↓
2. Open PulseMetrics
       ↓
3. Register
       ↓
4. Create organization
       ↓
5. Create project
       ↓
6. Generate API key
       ↓
7. Install/use browser SDK
       ↓
8. Send events
       ↓
9. Events enter Redpanda
       ↓
10. Worker processes them
       ↓
11. Events are stored in ClickHouse
       ↓
12. Analytics API queries the data
       ↓
13. Dashboard displays analytics
       ↓
14. WebSocket sends real-time updates
       ↓
15. Monitoring shows system health
       ↓
16. Alerts can trigger
       ↓
17. Tests pass
```

Everything should work end-to-end.

---

# 36. FIRST TASK

Start with **PHASE 1 — ARCHITECTURE**.

Do NOT immediately generate the complete application.

First provide:

1. System architecture
2. Monorepo structure
3. Service boundaries
4. PostgreSQL schema
5. ClickHouse schema
6. Redpanda topics
7. Event schema
8. REST API design
9. WebSocket event design
10. Authentication architecture
11. Multi-tenancy architecture
12. API key architecture
13. Redis strategy
14. Observability architecture
15. Docker architecture
16. Development roadmap
17. Key architectural trade-offs
18. Potential scalability bottlenecks
19. Security risks and mitigations

Then wait for my approval before proceeding to Phase 2.

When implementation begins, work in **small, verifiable increments** and always tell me:

- What you are implementing
- Which files are being created/changed
- Why the change is needed
- How to run it
- How to test it
- What should work after the change

The goal is not merely to produce code.

The goal is to build a **credible production-grade distributed analytics platform that can be presented as a serious Fullstack/Backend engineering portfolio project.**