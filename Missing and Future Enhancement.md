

````markdown
# ⚡ Real-Time Architecture & Future Readiness

The platform uses a modular real-time architecture designed to support live workforce operations while remaining extensible for future enterprise-scale infrastructure.

The current implementation uses **WebSocket / Socket.IO** for real-time communication. The architecture is designed so that future infrastructure such as **Redis, Kafka, RabbitMQ, PostgreSQL, cloud services, and horizontally scaled WebSocket servers** can be introduced without changing the core business logic.

---

## ⚡ Real-Time Architecture

```text
                         ┌─────────────────────┐
                         │   React Frontend    │
                         │                     │
                         │ Redux / React Query │
                         └──────────┬──────────┘
                                    │
                         REST + WebSocket
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │ Authentication      │
                         │ + Authorization     │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │ Express API         │
                         │ Business Services   │
                         └──────────┬──────────┘
                                    │
                         ┌──────────┴──────────┐
                         ▼                     ▼
                 ┌──────────────┐      ┌──────────────┐
                 │ MongoDB      │      │ Event        │
                 │ Persistence  │      │ Publisher    │
                 └──────────────┘      └──────┬───────┘
                                               │
                                               ▼
                                      ┌────────────────┐
                                      │ WebSocket /    │
                                      │ Socket.IO      │
                                      └───────┬────────┘
                                              │
                         ┌────────────────────┼────────────────────┐
                         ▼                    ▼                    ▼
                     ADMIN                  HR                  MANAGER
                         │                    │                    │
                         ▼                    ▼                    ▼
                    TEAM LEAD            EMPLOYEE          Authorized Clients
````

---

## 🔄 Real-Time Event Flow

All real-time operations follow a controlled event-driven flow.

```text
User Action
    ↓
REST API / Application Service
    ↓
Authentication
    ↓
RBAC / ABAC / Policy Authorization
    ↓
Business Validation
    ↓
MongoDB Transaction / Save
    ↓
Audit Log
    ↓
Domain Event
    ↓
Event Publisher
    ↓
WebSocket / Socket.IO
    ↓
Authorized Connected Clients
    ↓
Redux / TanStack React Query
    ↓
Live UI Update
```

The database remains the **source of truth**. WebSocket communication is used for live event delivery and UI synchronization.

---

# 📡 Real-Time Event Catalog

The platform defines standardized real-time events.

## Attendance Events

```text
attendance.checked_in
attendance.break_started
attendance.resumed
attendance.checked_out
attendance.correction_requested
attendance.correction_approved
attendance.correction_rejected
attendance.status_changed
```

## Employee Events

```text
employee.created
employee.updated
employee.deleted
employee.status_changed
employee.department_changed
employee.team_changed
```

## Notification Events

```text
notification.created
notification.read
notification.dismissed
notification.read_all
```

## Security Events

```text
security.geofence_violation
security.failed_authentication
security.invalid_mfa
security.token_reuse
security.permission_denied
security.suspicious_activity
```

## Workforce Events

```text
workforce.kpi_updated
workforce.employee_count_changed
workforce.attendance_rate_changed
workforce.department_updated
```

## Team Events

```text
team.member_added
team.member_removed
team.member_status_changed
team.attendance_updated
```

## System Events

```text
system.maintenance
system.announcement
system.configuration_changed
```

---

# 🧾 Real-Time Event Schema

Every event follows a standardized structure.

```typescript
interface RealtimeEvent<T = unknown> {
  id: string;
  type: string;
  timestamp: string;
  actorId: string;
  organizationId: string;
  departmentId?: string;
  teamId?: string;
  entityId?: string;
  sequenceNumber?: number;
  version?: number;
  payload: T;
}
```

### Event Example

```json
{
  "id": "evt_01JXYZ123",
  "type": "attendance.checked_in",
  "timestamp": "2026-08-12T04:25:17.000Z",
  "actorId": "user_102",
  "organizationId": "org_001",
  "departmentId": "dept_05",
  "teamId": "team_12",
  "entityId": "EMP-102",
  "sequenceNumber": 101,
  "version": 1,
  "payload": {
    "employeeId": "EMP-102",
    "status": "CHECKED_IN"
  }
}
```

---

# 🔐 Real-Time Authorization

WebSocket communication follows the same enterprise authorization model as REST APIs.

```text
WebSocket Connection
        ↓
JWT Validation
        ↓
User Identity
        ↓
Role
        ↓
Permissions
        ↓
Organization Scope
        ↓
Department Scope
        ↓
Team Scope
        ↓
Event Authorization
        ↓
Event Delivery
```

### Role-Based Real-Time Scope

| Role      | Real-Time Scope                    |
| --------- | ---------------------------------- |
| ADMIN     | Organization-wide events           |
| HR        | Authorized workforce and HR events |
| MANAGER   | Department and team events         |
| TEAM_LEAD | Team-level events                  |
| EMPLOYEE  | Personal/self-service events       |

A WebSocket connection does **not** automatically grant access to all events.

Every event must be filtered according to:

```text
User
+
Role
+
Permission
+
Organization
+
Department
+
Team
+
Resource
+
Action
=
Real-Time Access Decision
```

---

# 🔌 WebSocket Connection Lifecycle

```text
CONNECT
   ↓
Authenticate
   ↓
Authorize
   ↓
Register Connection
   ↓
Subscribe to Authorized Channels
   ↓
Receive Events
   ↓
Heartbeat / Ping
   ↓
Monitor Connection
   ↓
Disconnect
```

The connection manager tracks:

```text
Connection ID
User ID
Role
Organization
Department
Team
Connection Status
Last Activity
Subscribed Channels
```

---

# 🔄 Automatic Reconnection

Real-time connections support automatic recovery.

```text
Connected
    ↓
Connection Lost
    ↓
Retry
    ↓
Exponential Backoff
    ↓
Reconnect
    ↓
Re-authenticate
    ↓
Re-authorize
    ↓
Restore Subscriptions
    ↓
Synchronize Missed Events
    ↓
Return to Live Mode
```

Recommended retry intervals:

```text
1 second
2 seconds
4 seconds
8 seconds
16 seconds
30 seconds maximum
```

The client must avoid aggressive infinite reconnection loops.

---

# 🔄 Missed Event Synchronization

If a client disconnects while events are generated, the client can synchronize missed changes after reconnecting.

```text
Connection Lost
      ↓
Events Generated
      ↓
Connection Restored
      ↓
Send Last Event ID
      ↓
Backend Determines Missing Events
      ↓
Return Missed Events / Fresh Snapshot
      ↓
Update Client State
      ↓
Resume Live Events
```

Example endpoint:

```http
GET /api/realtime/sync?since=<event-id>
```

Alternative synchronization:

```http
GET /api/realtime/sync?since=<timestamp>
```

---

# 🆔 Event Idempotency

Every real-time event contains a unique event ID.

```text
evt_001
evt_002
evt_003
```

The frontend tracks recently processed events.

```typescript
if (processedEvents.has(event.id)) {
  return;
}

processedEvents.add(event.id);
processEvent(event);
```

This prevents duplicate UI updates and duplicate notifications when an event is delivered more than once.

---

# 🔢 Event Ordering

Events that depend on sequence must preserve logical ordering.

Example:

```text
101 → Check-In
102 → Break
103 → Resume
104 → Check-Out
```

Events contain:

```typescript
sequenceNumber?: number;
version?: number;
```

The client can detect:

```text
Duplicate Event
Out-of-Order Event
Stale Event
Missing Event
```

When an event gap is detected:

```text
Event 101
Event 102
Event 104
     ↓
Missing 103 detected
     ↓
Synchronization request
```

---

# 🟢 Real-Time Connection Status

The frontend exposes the current real-time connection state.

```text
🟢 Live
🟡 Reconnecting...
🔴 Offline
```

Example:

```text
Real-Time Status: Live
Last Synchronized: 04:25:17
```

This status can be displayed in the enterprise header or system status area.

---

# ⏱️ Real-Time Attendance

Attendance operations can update authorized dashboards without requiring manual page refresh.

```text
Employee Check-In
      ↓
Attendance API
      ↓
MongoDB
      ↓
Attendance Event
      ↓
WebSocket
      ↓
Manager / Team Lead Dashboard
      ↓
Live Employee Status
```

Example:

```text
EMP-102
Status: 🟢 Checked In
```

When the employee starts a break:

```text
EMP-102
Status: 🟡 On Break
```

When the employee resumes:

```text
EMP-102
Status: 🟢 Checked In
```

---

# 📊 Real-Time Workforce KPIs

The following KPIs can be updated through real-time events:

```text
Total Employees
Present Today
Absent Today
On Break
Checked Out
Late Employees
Attendance Rate
Active Employees
```

Example:

```text
Attendance Event
      ↓
Affected KPI Calculation
      ↓
workforce.kpi_updated
      ↓
Dashboard
      ↓
Live KPI Card Update
```

---

# 👥 Real-Time Employee Directory

Employee status changes can be reflected immediately in the employee table.

```text
Employee       Status
--------------------------------
EMP-001        🟢 Checked In
EMP-002        🟡 On Break
EMP-003        🔴 Checked Out
EMP-004        🟢 Checked In
```

No manual page refresh is required for authorized live updates.

---

# 🔔 Real-Time Notifications

Notifications use a lifecycle model.

```text
CREATED
   ↓
DELIVERED
   ↓
READ
   ↓
DISMISSED
```

Notification records include:

```text
id
user_id
type
title
message
entity_type
entity_id
is_read
created_at
read_at
```

Real-time events:

```text
notification.created
notification.read
notification.dismissed
notification.read_all
```

---

# 🚨 Real-Time Security Events

Security events are delivered to authorized administrators and security-aware roles.

Examples:

```text
Geofence violation
Failed authentication
Invalid MFA attempt
Token reuse
Permission denial
Suspicious activity
```

Example:

```text
🔴 Security Alert

Employee: EMP-103
Event: Geofence Violation
Time: 04:21:10
Action: Attendance rejected
```

---

# 🧾 Audit Logging and Real-Time Events

Audit logging remains persistent and independent of WebSocket availability.

```text
User Action
     ↓
Business Service
     ├── MongoDB Save
     ├── Audit Record
     └── Real-Time Event
```

The WebSocket layer is **not** the source of truth.

If no client is connected, the business operation and audit record must still succeed.

---

# 📧 Asynchronous Company Email Notifications

Company email notifications are decoupled from transactional operations.

### Incorrect

```text
Check-In
   ↓
Send Email
   ↓
Wait for Email
   ↓
Save Attendance
```

### Recommended

```text
Check-In
   ↓
Validate
   ↓
Save Attendance
   ↓
Audit Log
   ↓
Publish Event
   ├── WebSocket Notification
   ├── In-App Notification
   └── Company Email Job
```

If email delivery fails:

```text
Attendance = SUCCESS
Email = RETRY
```

Attendance operations must not depend on successful email delivery.

---

# 📧 Company Communication Policy

The platform uses official company communication channels only.

Personal email addresses must not be used for:

* Project communication
* Notification configuration
* Repository documentation
* Production configuration
* Company email integration

Company email configuration must be stored in environment variables.

```env
COMPANY_EMAIL=
COMPANY_EMAIL_HOST=
COMPANY_EMAIL_PORT=
COMPANY_EMAIL_USER=
COMPANY_EMAIL_PASSWORD=
```

Sensitive credentials must never be committed to Git.

---

# 🏗️ Frontend Real-Time Architecture

Recommended frontend structure:

```text
frontend/src/
│
├── realtime/
│   ├── socket.ts
│   ├── realtimeClient.ts
│   ├── realtimeEvents.ts
│   ├── realtimeTypes.ts
│   ├── realtimeStore.ts
│   ├── realtimeHooks.ts
│   ├── connectionManager.ts
│   ├── subscriptionManager.ts
│   └── eventProcessor.ts
│
├── notifications/
│   ├── components/
│   ├── hooks/
│   ├── services/
│   └── types/
```

Recommended hooks:

```typescript
useRealtimeConnection()
useRealtimeEvent()
useAttendanceEvents()
useNotificationEvents()
useEmployeeEvents()
useSecurityEvents()
```

---

# 🏗️ Backend Real-Time Architecture

Recommended backend structure:

```text
backend/src/
│
├── realtime/
│   ├── socketServer.ts
│   ├── socketAuth.ts
│   ├── socketAuthorization.ts
│   ├── eventPublisher.ts
│   ├── eventTypes.ts
│   ├── eventRegistry.ts
│   ├── connectionManager.ts
│   └── subscriptionManager.ts
```

Real-time functionality should remain separate from Express controllers and business services.

---

# 📡 Event Publisher Abstraction

The platform should use an abstraction for publishing events.

```typescript
interface EventPublisher {
  publish(event: RealtimeEvent): Promise<void>;
}
```

Current implementation:

```text
EventPublisher
      ↓
Socket.IO
```

Future implementations can include:

```text
EventPublisher
      ├── Socket.IO
      ├── Redis
      ├── Kafka
      └── RabbitMQ
```

This allows the real-time infrastructure to evolve without rewriting business services.

---

# 🗄️ Persistence vs Real-Time State

## Persistent Business Data

MongoDB remains responsible for:

```text
Users
Roles
Permissions
Employees
Departments
Teams
Attendance
Attendance Corrections
Notifications
Audit Logs
MFA Challenges
Refresh Tokens / Sessions
```

## Transient Real-Time State

The WebSocket layer manages:

```text
Connected Users
Connection IDs
Subscriptions
Presence
Live Event Delivery
Connection Status
```

Real-time connection state should not replace persistent business data.

---

# 📊 Real-Time Monitoring

Future production monitoring should track:

```text
Active WebSocket Connections
Events Per Minute
Connection Failures
Reconnect Count
Event Delivery Failures
Average Event Latency
Unauthorized Subscription Attempts
Authentication Failures
```

Example:

```text
Connected Users:       183
Events / Minute:       427
Average Latency:       82 ms
Reconnects:            6
Failed Events:         0
Unauthorized Events:   0
```

---

# 🛡️ Real-Time Rate Limiting

Rate limiting should protect both REST and real-time infrastructure.

Protected operations include:

```text
Login
OTP Verification
MFA Verification
Refresh Token
WebSocket Connections
Subscription Requests
Notification Actions
Attendance Actions
```

This prevents abuse and excessive connection attempts.

---

# 🧪 Real-Time Testing

Real-time functionality should include dedicated tests.

### Connection Tests

```text
WebSocket connection
Authentication
Disconnection
Reconnection
Heartbeat
```

### Authorization Tests

```text
RBAC
ABAC
Organization scope
Department scope
Team scope
Employee self-scope
Unauthorized subscription
```

### Event Tests

```text
Event delivery
Duplicate events
Event ordering
Missing events
Event synchronization
Event filtering
```

### Notification Tests

```text
Notification creation
Notification delivery
Notification read
Notification dismissal
```

### Attendance Tests

```text
Check-In event
Break event
Resume event
Check-Out event
Attendance status update
```

### Security Tests

```text
Geofence events
Failed authentication events
MFA events
Permission denial events
Security notification delivery
```

---

# 🔒 Multi-User Isolation Testing

Real-time authorization must prevent data leakage between users.

Example:

```text
Employee A
    ↓
attendance.checked_in
    ↓
Employee B
    ↓
❌ Must NOT receive Employee A's private event
```

Manager scope:

```text
Manager
   ↓
Department A
   ↓
✅ Department A events
   ↓
❌ Department B events
```

Team Lead scope:

```text
Team Lead
   ↓
Team A
   ↓
✅ Team A events
   ↓
❌ Team B events
```

---

# 🚀 Future Scalability

The current architecture is designed for MongoDB and a single application environment.

Future enterprise deployment can evolve toward:

```text
                         ┌──────────────┐
                         │ React Client │
                         └──────┬───────┘
                                │
                         Load Balancer
                                │
              ┌─────────────────┼─────────────────┐
              ▼                 ▼                 ▼
        API Server 1      API Server 2      API Server 3
              │                 │                 │
              └─────────────────┼─────────────────┘
                                │
                         Event Infrastructure
                                │
                    ┌───────────┼───────────┐
                    ▼           ▼           ▼
                  Redis       Kafka      RabbitMQ
                    │           │           │
                    └───────────┼───────────┘
                                │
                       WebSocket Gateway
                                │
                           React Clients
```

Potential future infrastructure:

```text
Redis
Kafka
RabbitMQ
PostgreSQL
Cloud Database
Containerization
Kubernetes
Horizontal WebSocket Scaling
Distributed Tracing
Centralized Logging
```

These technologies are **future scalability options** and are not required for the current MongoDB implementation.

---

# 📈 Real-Time Feature Roadmap

| Feature                      | Current Status | Future Enhancement   |
| ---------------------------- | -------------- | -------------------- |
| WebSocket / Socket.IO        | ✅ Implemented  | —                    |
| Real-time attendance         | ✅ Implemented  | —                    |
| Real-time notifications      | ✅ Implemented  | —                    |
| Real-time employee updates   | ✅ Implemented  | Expand               |
| Real-time KPI updates        | 🔶 Partial     | Expand               |
| WebSocket authentication     | 🔶 Implemented | Harden               |
| RBAC event authorization     | 🔶 Implemented | Harden               |
| ABAC event authorization     | 🔶 Implemented | Harden               |
| Reconnection                 | 🔶 Partial     | Complete             |
| Missed-event synchronization | ⏳ Planned      | Implement            |
| Event idempotency            | ⏳ Planned      | Implement            |
| Event ordering               | ⏳ Planned      | Implement            |
| Live presence                | ⏳ Planned      | Implement            |
| Security event stream        | ⏳ Planned      | Expand               |
| Real-time monitoring         | ⏳ Planned      | Implement            |
| Event queue                  | ⏳ Future       | Redis/Kafka/RabbitMQ |
| Multi-instance WebSocket     | ⏳ Future       | Redis Adapter        |
| Horizontal scaling           | ⏳ Future       | Load Balancer        |
| Distributed tracing          | ⏳ Future       | OpenTelemetry        |
| Centralized logging          | ⏳ Future       | Enterprise logging   |

---

# 🧭 Future Development Priorities

The platform can evolve through the following phases.

## Phase 1 — Current Real-Time Foundation

```text
WebSocket
Socket.IO
Authentication
Authorization
Attendance Events
Notification Events
Employee Events
```

## Phase 2 — Reliability

```text
Automatic Reconnection
Event IDs
Idempotency
Event Ordering
Missed Event Synchronization
Connection Status
```

## Phase 3 — Advanced Workforce Intelligence

```text
Live KPIs
Live Presence
Security Event Stream
Real-Time Team Monitoring
Advanced Notification Center
```

## Phase 4 — Enterprise Scaling

```text
Redis
Distributed WebSocket
Event Queue
Kafka / RabbitMQ
Horizontal Scaling
Load Balancing
```

## Phase 5 — Production Observability

```text
Centralized Logging
Metrics
Tracing
Event Latency Monitoring
Security Monitoring
Alerting
```

---

# 📌 Real-Time Design Principles

The platform follows these principles:

1. **MongoDB remains the source of truth.**
2. **WebSocket events are delivery mechanisms, not persistent business records.**
3. **Every real-time connection must be authenticated.**
4. **Every real-time event must respect RBAC, ABAC and policy-based authorization.**
5. **Organization, department, team and employee scopes apply to real-time events.**
6. **Events must contain unique identifiers.**
7. **Duplicate events must be safely handled.**
8. **Important events should support ordering/versioning.**
9. **Disconnected clients must be able to synchronize missed changes.**
10. **Real-time functionality must not compromise database consistency.**
11. **Company email delivery must remain asynchronous.**
12. **Sensitive configuration must remain in environment variables.**
13. **Real-time infrastructure must be modular and replaceable.**
14. **Future Redis/Kafka/RabbitMQ integration should not require rewriting business services.**
15. **Real-time communication must be observable and testable.**

---

# 🚀 Enterprise Real-Time Architecture Summary

The Workforce Analytics Intelligence Platform combines:

### Secure Authentication

```text
JWT
+
Refresh Tokens
+
MFA
+
OTP
```

### Enterprise Authorization

```text
RBAC
+
ABAC
+
Policy-Based Authorization
+
Organization Scope
+
Department Scope
+
Team Scope
+
Employee Scope
```

### Real-Time Workforce Operations

```text
WebSocket
+
Socket.IO
+
Attendance Events
+
Employee Events
+
Notification Events
+
Security Events
+
Workforce KPI Events
```

### Reliable Event Processing

```text
Event IDs
+
Idempotency
+
Event Ordering
+
Reconnection
+
Missed Event Synchronization
```

### Enterprise Data

```text
MongoDB
+
Transactions
+
Foreign Keys
+
Indexes
+
Audit Logs
+
250 Unique Employees
```

### Future Scalability

```text
Redis
+
Kafka
+
RabbitMQ
+
PostgreSQL
+
Horizontal Scaling
+
Load Balancing
+
Distributed Observability
```

The architecture is therefore designed to support the current **MongoDB + Express + React + Socket.IO** implementation while providing a clear upgrade path toward a larger enterprise real-time infrastructure in the future.

```

**One important correction:** don't mark future items such as missed-event synchronization, event ordering, Redis/Kafka scaling, or distributed tracing as **Completed** unless they are actually implemented in your repository. Keep them as `Planned`, `Partial`, or `Future` until verified.
```

# ⚡ Real-Time Architecture & Future Readiness

The platform uses a modular real-time architecture designed to support live workforce operations while remaining extensible for future enterprise-scale infrastructure.

The current implementation uses **WebSocket / Socket.IO** for real-time communication. The architecture is designed so that future infrastructure such as **Redis, Kafka, RabbitMQ, PostgreSQL, cloud services, and horizontally scaled WebSocket servers** can be introduced without changing the core business logic.

---

## ⚡ Real-Time Architecture

```text
                         ┌─────────────────────┐
                         │   React Frontend    │
                         │                     │
                         │ Redux / React Query │
                         └──────────┬──────────┘
                                    │
                         REST + WebSocket
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │ Authentication      │
                         │ + Authorization     │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │ Express API         │
                         │ Business Services   │
                         └──────────┬──────────┘
                                    │
                         ┌──────────┴──────────┐
                         ▼                     ▼
                 ┌──────────────┐      ┌──────────────┐
                 │ MongoDB      │      │ Event        │
                 │ Persistence  │      │ Publisher    │
                 └──────────────┘      └──────┬───────┘
                                              │
                                              ▼
                                      ┌────────────────┐
                                      │ WebSocket /    │
                                      │ Socket.IO      │
                                      └───────┬────────┘
                                              │
                         ┌────────────────────┼────────────────────┐
                         ▼                    ▼                    ▼
                       ADMIN                  HR                  MANAGER
                         │                    │                    │
                         ▼                    ▼                    ▼
                     TEAM LEAD             EMPLOYEE          Authorized Clients

```

---

## 🔄 Real-Time Event Flow

All real-time operations follow a controlled event-driven flow.

```text
User Action
    ↓
REST API / Application Service
    ↓
Authentication
    ↓
RBAC / ABAC / Policy Authorization
    ↓
Business Validation
    ↓
MongoDB Transaction / Save
    ↓
Audit Log
    ↓
Domain Event
    ↓
Event Publisher
    ↓
WebSocket / Socket.IO
    ↓
Authorized Connected Clients
    ↓
Redux / TanStack React Query
    ↓
Live UI Update

```

The database remains the **source of truth**. WebSocket communication is used for live event delivery and UI synchronization.

---

# 📡 Real-Time Event Catalog

The platform defines standardized real-time events.

## Attendance Events

```text
attendance.checked_in
attendance.break_started
attendance.resumed
attendance.checked_out
attendance.correction_requested
attendance.correction_approved
attendance.correction_rejected
attendance.status_changed

```

## Employee Events

```text
employee.created
employee.updated
employee.deleted
employee.status_changed
employee.department_changed
employee.team_changed

```

## Notification Events

```text
notification.created
notification.read
notification.dismissed
notification.read_all

```

## Security Events

```text
security.geofence_violation
security.failed_authentication
security.invalid_mfa
security.token_reuse
security.permission_denied
security.suspicious_activity

```

## Workforce Events

```text
workforce.kpi_updated
workforce.employee_count_changed
workforce.attendance_rate_changed
workforce.department_updated

```

## Team Events

```text
team.member_added
team.member_removed
team.member_status_changed
team.attendance_updated

```

## System Events

```text
system.maintenance
system.announcement
system.configuration_changed

```

---

# 🧾 Real-Time Event Schema

Every event follows a standardized structure.

```typescript
interface RealtimeEvent<T unknown> {
  id: string;
  type: string;
  timestamp: string;
  actorId: string;
  organizationId: string;
  departmentId?: string;
  teamId?: string;
  entityId?: string;
  sequenceNumber?: number;
  version?: number;
  payload: T;
}

```

### Event Example

```json
{
  "id": "evt_01JXYZ123",
  "type": "attendance.checked_in",
  "timestamp": "2026-08-12T04:25:17.000Z",
  "actorId": "user_102",
  "organizationId": "org_001",
  "departmentId": "dept_05",
  "teamId": "team_12",
  "entityId": "EMP-102",
  "sequenceNumber": 101,
  "version": 1,
  "payload": {
    "employeeId": "EMP-102",
    "status": "CHECKED_IN"
  }
}

```

---

# 🔐 Real-Time Authorization

WebSocket communication follows the same enterprise authorization model as REST APIs.

```text
WebSocket Connection
        ↓
JWT Validation
        ↓
User Identity
        ↓
Role
        ↓
Permissions
        ↓
Organization Scope
        ↓
Department Scope
        ↓
Team Scope
        ↓
Event Authorization
        ↓
Event Delivery

```

### Role-Based Real-Time Scope

| Role | Real-Time Scope |
| --- | --- |
| ADMIN | Organization-wide events |
| HR | Authorized workforce and HR events |
| MANAGER | Department and team events |
| TEAM_LEAD | Team-level events |
| EMPLOYEE | Personal/self-service events |

A WebSocket connection does **not** automatically grant access to all events. Every event must be filtered according to:

```text
User + Role + Permission + Organization + Department + Team + Resource + Action = Real-Time Access Decision

```

---

# 🔌 WebSocket Connection Lifecycle

```text
CONNECT
   ↓
Authenticate
   ↓
Authorize
   ↓
Register Connection
   ↓
Subscribe to Authorized Channels
   ↓
Receive Events
   ↓
Heartbeat / Ping
   ↓
Monitor Connection
   ↓
Disconnect

```

---

# 🔄 Automatic Reconnection

Real-time connections support automatic recovery.

```text
Connection Lost → Retry → Exponential Backoff → Reconnect → Re-authenticate → Restore Subscriptions

```

Recommended retry intervals: `1s → 2s → 4s → 8s → 16s → 30s maximum`. The client must avoid aggressive infinite reconnection loops.

---

# 🔄 Missed Event Synchronization

If a client disconnects while events are generated, the client can synchronize missed changes after reconnecting.

```text
Connection Restored → Send Last Event ID → Backend Determines Missing Events → Update Client State

```

Example endpoint:

```http
GET /api/realtime/sync?since=<event-id>

```

---

# 🆔 Event Idempotency

Every real-time event contains a unique event ID to prevent duplicate UI updates.

```typescript
if (processedEvents.has(event.id)) {
  return;
}

processedEvents.add(event.id);
processEvent(event);

```

---

# 🔢 Event Ordering

Events that depend on sequence must preserve logical ordering using `sequenceNumber` and `version`. When an event gap is detected, the client triggers a synchronization request.

---

# 🟢 Real-Time Connection Status

The frontend exposes the current real-time connection state (`🟢 Live`, `🟡 Reconnecting...`, `🔴 Offline`), which can be displayed in the enterprise header.

---

# ⏱️ Real-Time Attendance

Attendance operations can update authorized dashboards without requiring manual page refresh.

```text
Employee Check-In → Attendance API → MongoDB → Attendance Event → WebSocket → Dashboard Update

```

---

# 🧾 Audit Logging and Real-Time Events

Audit logging remains persistent and independent of WebSocket availability. The WebSocket layer is **not** the source of truth. If no client is connected, the business operation and audit record must still succeed.

---

# 📧 Asynchronous Company Email Notifications

Company email notifications are decoupled from transactional operations. Attendance operations must not depend on successful email delivery.

Sensitive credentials must never be committed to Git and should remain in environment variables (`COMPANY_EMAIL`, `COMPANY_EMAIL_HOST`, etc.).

---

# 🏗️ Backend Real-Time Architecture

Recommended backend structure:

```text
backend/src/
│
├── realtime/
│   ├── socketServer.ts
│   ├── socketAuth.ts
│   ├── socketAuthorization.ts
│   ├── eventPublisher.ts
│   ├── eventTypes.ts
│   ├── eventRegistry.ts
│   ├── connectionManager.ts
│   └── subscriptionManager.ts

```

---

# 📡 Event Publisher Abstraction

The platform uses an abstraction for publishing events.

```typescript
interface EventPublisher {
  publish(event: RealtimeEvent): Promise<void>;
}

```

This allows the real-time infrastructure to evolve (e.g., from Socket.IO to Redis/Kafka) without rewriting business services.

---

# 🗄️ Persistence vs Real-Time State

**Persistent Business Data (MongoDB):** Users, Roles, Permissions, Employees, Attendance, Notifications, Audit Logs, Sessions.
**Transient Real-Time State (WebSocket):** Connected Users, Connection IDs, Subscriptions, Presence, Live Event Delivery.

Real-time connection state should not replace persistent business data.

---

# 🚀 Future Scalability

The current architecture is designed for MongoDB and a single application environment. Future enterprise deployment can evolve toward Redis, Kafka, RabbitMQ, PostgreSQL, Kubernetes, and horizontal scaling.

These technologies are **future scalability options** and are not required for the current MongoDB implementation.

---

# 📈 Real-Time Feature Roadmap

| Feature | Current Status | Future Enhancement |
| --- | --- | --- |
| WebSocket / Socket.IO | ✅ Implemented | — |
| Real-time attendance | ✅ Implemented | — |
| Real-time notifications | ✅ Implemented | — |
| Real-time employee updates | ✅ Implemented | Expand |
| WebSocket authentication | 🔶 Partial | Harden |
| RBAC event authorization | 🔶 Partial | Harden |
| ABAC event authorization | 🔶 Partial | Harden |
| Reconnection | 🔶 Partial | Complete |
| Real-time KPI updates | ⏳ Planned | Implement |
| Missed-event synchronization | ⏳ Planned | Implement |
| Event idempotency | ⏳ Planned | Implement |
| Event ordering | ⏳ Planned | Implement |
| Live presence | ⏳ Planned | Implement |
| Security event stream | ⏳ Planned | Expand |
| Real-time monitoring | ⏳ Planned | Implement |
| Event queue | ⏳ Future | Redis/Kafka/RabbitMQ |
| Multi-instance WebSocket | ⏳ Future | Redis Adapter |
| Horizontal scaling | ⏳ Future | Load Balancer |
| Distributed tracing | ⏳ Future | OpenTelemetry |
| Centralized logging | ⏳ Future | Enterprise logging |

---

# 📌 Real-Time Design Principles

1. **MongoDB remains the source of truth.**
2. **WebSocket events are delivery mechanisms, not persistent business records.**
3. **Every real-time connection must be authenticated.**
4. **Every real-time event must respect RBAC, ABAC and policy-based authorization.**
5. **Organization, department, team and employee scopes apply to real-time events.**
6. **Events must contain unique identifiers.**
7. **Duplicate events must be safely handled.**
8. **Important events should support ordering/versioning.**
9. **Disconnected clients must be able to synchronize missed changes.**
10. **Real-time functionality must not compromise database consistency.**
11. **Real-time infrastructure must be modular and replaceable.**
12. **Future distributed integration should not require rewriting core logic.**
