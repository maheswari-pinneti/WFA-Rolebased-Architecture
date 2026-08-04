# Workforce Analytics Dashboard (WFA)

## Enterprise Solution Architecture & Technical Specification

### Document Control & Metadata

* **Document Type:** Technical Solution Architecture & UI/UX Specification
* **Program Name:** Workforce Analytics Dashboard (WFA) Program
* **Author:** Reddi Uday Kumar, Team Lead
* **Target Audience:** Architecture Review Board, Software Engineering, Security Engineering, Product Management, and Key Stakeholders
* **Baseline Status:** Production Implementation Baseline (v1.0)
* **Effective Date:** August 4, 2026

---

## Executive Summary & Architecture Outcome

The **Workforce Analytics Dashboard (WFA)** is designed as a secure, modular, and horizontally scalable enterprise application. The platform provides real-time operational visibility, workforce management tools, and predictive workforce analytics across complex, multi-departmental enterprise organizations.

```
+-----------------------------------------------------------------------------------+
|                                 CLIENT TIER                                       |
|             React Web Application & WCAG 2.2 AA Design System                     |
+-----------------------------------------------------------------------------------+
                                         |
                                         v
+-----------------------------------------------------------------------------------+
|                                  EDGE TIER                                        |
|                     DNS -> CDN -> WAF -> API Gateway                              |
+-----------------------------------------------------------------------------------+
                                         |
                                         v
+-----------------------------------------------------------------------------------+
|                             PRESENTATION / BFF TIER                               |
|        Auth N/Z Policy Enforcement | Rate Limiting | Request Validation           |
+-----------------------------------------------------------------------------------+
                                         |
                                         v
+-----------------------------------------------------------------------------------+
|                               BUSINESS / DOMAIN TIER                              |
|           DDD Bounded Contexts | Application Services | Domain Rules          |
+-----------------------------------------------------------------------------------+
                                         |
                                         v
+-----------------------------------------------------------------------------------+
|                               PERSISTENCE & DATA TIER                             |
|    PostgreSQL (System of Record) | Redis Cache | Async Workers | Warehouse     |
+-----------------------------------------------------------------------------------+
```

### Core Architecture Outcomes

1. **Decoupled Architecture:** Strict separation between UI presentation, UI orchestration, business domain logic, and data persistence layers.
2. **Zero-Trust Security:** Enforces Multi-Factor Authentication (MFA), role-based access control (RBAC), department-based access control (DBAC), and policy-based access control (PBAC) strictly at the API gateway and repository boundaries.
3. **Governed Metrics:** All executive Key Performance Indicators (KPIs) and analytical metrics are computed via centralized backend read models to prevent frontend metric drift.
4. **Operational Isolation:** Operational OLTP workloads are isolated from heavy historical OLAP analytics using CQRS-inspired read replicas and warehouse pipelines.

---

## Table of Contents

1. Executive Architecture Decisions
2. Quality Attributes & Non-Functional Requirements
3. Enterprise System Architecture & Edge Tier
4. Standard N-Tier Layered Architecture
5. UI Architecture: Model-View-Presenter (MVP) Pattern
6. Domain-Driven Design (DDD) & Bounded Contexts
7. Frontend Architecture & Module Design
8. Backend Clean Architecture & Domain Services
9. Database Architecture & Entity Relationship (3NF) Model
10. Authentication & Session Security Workflow
11. Fine-Grained Authorization: RBAC + DBAC + PBAC
12. Enterprise Role Permission Matrix
13. Enterprise Design System & Accessibility (WCAG 2.2 AA)
14. Responsive Application Header Architecture
15. Dynamic Sidebar & Navigation Architecture
16. Responsive Dashboard & 12-Column Grid Layout
17. Executive KPI Card Anatomy & Governance
18. Analytics Data Path & Visualizations
19. Navigation Guard & Route Flow
20. REST API Design & Request Lifecycle
21. Asynchronous Processing & Outbox Workflows
22. Production Deployment Infrastructure
23. Observability, Telemetry, & Security Audit
24. End-to-End Operational Workflow
25. Testing & Quality Assurance Strategy
26. Implementation Roadmap
27. Production Acceptance Criteria & Go-Live Checklist

---

## 1. Executive Architecture Decisions

The platform baseline is a **Modular Monolith** organized by Domain-Driven Design (DDD) bounded contexts, exposed via a stateless RESTful API, and backed by a PostgreSQL relational database.

| Architectural Dimension | Baseline Choice | Rationale / Trade-Off Analysis |
| --- | --- | --- |
| **Application Style** | Modular React Frontend + DDD Modular Backend | Maintains a single cohesive deployment unit during initial scale while maintaining hard isolation boundaries between domain contexts. |
| **UI Design Pattern** | Model-View-Presenter (MVP) with Typed `ViewState` | Isolates React components from business decisions, making Presenters fully testable via unit tests without rendering UI components. |
| **Data Access Pattern** | Repository + Unit of Work Pattern | Centralizes query scoping, database transaction boundaries, caching strategies, and ORM abstractions. |
| **Authorization Model** | Hybrid RBAC + DBAC + PBAC (Deny-By-Default) | Enforces job role permissions, department organizational hierarchy boundaries, and context-aware action conditions. |
| **Analytics Architecture** | CQRS Read Models + Asynchronous Warehouse Sync | Prevents analytical aggregations from locking or slowing operational employee transactional tables. |
| **Integration Pattern** | REST API + Transactional Outbox Domain Events | Guarantees synchronous caller contracts alongside reliable asynchronous worker processing for notifications and reports. |
| **Deployment Model** | Containerized (Docker/K8s), Multi-AZ Private Subnets | Guarantees horizontal scalability, automated failover, zero-downtime rolling updates, and private data plane isolation. |

---

## 2. Quality Attributes & Non-Functional Requirements

- **Security:** Zero-trust architecture. MFA required for all administrative actions. Short-lived access tokens (15 mins) paired with rotating refresh tokens stored in `HttpOnly`, `Secure`, `SameSite=Strict` cookies. All security failures undergo automated audit logging.
- **Scalability:** Stateless API replicas capable of horizontal auto-scaling based on CPU/memory metrics. Materialized read models in Redis reduce DB read IOPS.
- **Performance:** Sub-200ms p95 latency target for operational APIs. Route-level code splitting on the frontend; DB queries utilize indexes constrained by tenant/department scopes.
- **Availability:** 99.95% multi-AZ operational SLA with automated health checks, database read replicas, and graceful degradation during background maintenance.
- **Accessibility:** Target compliance with **WCAG 2.2 Level AA** standards, including full keyboard navigation, screen-reader aria attributes, and high-contrast visuals.

---

## 3. Fine-Grained Authorization: RBAC + DBAC + PBAC

### Enterprise Role Permission Matrix

| Permission Code | Admin | HR Manager | Dept Manager | Team Lead | Employee |
| --- | --- | --- | --- | --- | --- |
| `USER_CREATE` | **Allow** | Deny | Deny | Deny | Deny |
| `USER_UPDATE` | **Allow** | Deny | Deny | Deny | Self Profile Only |
| `USER_DELETE` | **Allow** | Deny | Deny | Deny | Deny |
| `USER_VIEW` | **Allow** | Scoped | Scoped | Team Scoped | Self Record |
| `EMPLOYEE_VIEW` | **Allow** | Org Scoped | Dept Scoped | Team Scoped | Self Record |
| `EMPLOYEE_UPDATE` | **Allow** | Org Scoped | Limited Dept | Deny | Self Fields |
| `ATTENDANCE_APPROVE` | **Allow** | Org Scoped | Dept Scoped | Team Scoped | Deny |
| `PERFORMANCE_VIEW` | **Allow** | Org Scoped | Dept Scoped | Team Scoped | Self Reviews |
| `REPORT_EXPORT` | **Allow** | Org Scoped | Dept Scoped | Policy Scoped | Personal Reports |
| `PAYROLL_VIEW` | **Allow** | Policy Scoped | Deny | Deny | Self Payslip |
| `SYSTEM_CONFIG` | **Allow (MFA)** | Deny | Deny | Deny | Deny |

---

## 4. Enterprise Design System & Tokens

| Token | Hex Value | Usage |
| :--- | :--- | :--- |
| **Primary** | `#2563EB` | Primary actions, active navigation, key data series |
| **Secondary** | `#0F172A` | Headers, high-emphasis text, dark surfaces |
| **Accent** | `#14B8A6` | Secondary highlights and supporting series |
| **Success** | `#22C55E` | Positive status and improvements |
| **Warning** | `#F59E0B` | Attention and pending states |
| **Danger** | `#EF4444` | Errors, destructive actions, negative alerts |
| **Background** | `#F8FAFC` | Light-theme application canvas |

---

## 5. Responsive Sidebar & Header Architecture

- **Desktop Sidebar Expanded Width**: `264px` (collapsed icon rail: `72px`).
- **Mobile Drawer**: Slide-out overlay drawer (`max-width: 320px`) with focus trapping, backdrop click close, and Escape key listeners.
- **Header**: Includes left toggle button & breadcrumbs, center global search input (`Ctrl + K`), right notifications bell, theme switcher, support help desk, and 32px circular user profile avatar dropdown.
