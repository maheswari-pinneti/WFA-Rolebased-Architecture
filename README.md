# Enterprise Workforce Analytics Intelligence Platform

An enterprise-grade **Workforce Analytics and Intelligence Platform** built with a unified full-stack architecture using **React 18, TypeScript, Node.js, Express.js, SQLite, Redux Toolkit, React Query, and Recharts**.

The platform provides secure workforce management through **RBAC, ABAC, and policy-based authorization**, with dedicated dashboards for five enterprise roles.

---

## 🚀 Platform Overview

The Workforce Analytics Intelligence Platform provides:

* 🔐 Five-tier role-based access control
* 🛡️ RBAC, ABAC, and policy-based authorization
* 🔑 JWT authentication with refresh-token support
* 📱 MFA / OTP authentication flow
* 👥 250 uniquely seeded employee records
* 🚫 Duplicate employee ID prevention
* 📊 Workforce and employee analytics
* ⏱️ Attendance management
* 📍 Geofencing and attendance verification
* 🔄 Offline attendance synchronization
* 🔔 Notifications and security alerts
* 📈 Interactive charts with loading, empty, and error states
* 🎨 Consistent theme support across every role
* 🌓 Light and dark mode
* 📋 Searchable and filterable employee table
* 📤 CSV employee/data export
* 🧾 Attendance correction history
* 📝 Audit logging
* ⚡ Real-time attendance and notification updates
* 🔒 Protected routes and permission guards
* 📱 Responsive enterprise dashboard layout

---

# 👥 Five Role Architecture

The platform supports five primary enterprise roles:

| Role          | Access Scope                | Dashboard              |
| ------------- | --------------------------- | ---------------------- |
| **ADMIN**     | Organization-wide           | `/admin/dashboard`     |
| **HR**        | Workforce and HR operations | `/hr/dashboard`        |
| **MANAGER**   | Department/team management  | `/manager/dashboard`   |
| **TEAM LEAD** | Team-level operations       | `/team-lead/dashboard` |
| **EMPLOYEE**  | Personal/self-service       | `/employee/dashboard`  |

Each role receives its own authorized navigation, dashboard widgets, data scope, actions, and permissions.

---

# 📸 Dashboard Screenshots

## 🔴 Admin Dashboard

The Admin dashboard provides organization-wide workforce visibility, user management, permissions, system analytics, audit information, and administrative controls.

![Admin Dashboard](docs/screenshots/admin-dashboard.png)

---

## 🟣 HR Dashboard

The HR dashboard provides workforce statistics, employee management, attendance analytics, department information, hiring trends, and HR operations.

![HR Dashboard](docs/screenshots/hr-dashboard.png)

---

## 🔵 Manager Dashboard

The Manager dashboard focuses on department/team workforce performance, attendance, employee statistics, productivity, and team analytics.

![Manager Dashboard](docs/screenshots/manager-dashboard.png)

---

## 🟢 Team Lead Dashboard

The Team Lead dashboard provides team-level employee information, attendance monitoring, performance information, and operational insights.

![Team Lead Dashboard](docs/screenshots/team-lead-dashboard.png)

---

## 🟠 Employee Dashboard

The Employee dashboard provides employee self-service functionality including personal information, attendance, check-in/check-out, notifications, and individual workforce insights.

![Employee Dashboard](docs/screenshots/employee-dashboard.png)

---

# 🏗️ Project Architecture

## 📁 Repository Structure

```text
WFA-Rolebased-Architecture/
│
├── frontend/       # React + TypeScript application
├── backend/        # Node.js + Express REST API
├── database/       # SQLite database, migrations & seed data
├── docs/           # Documentation, architecture & dashboard screenshots
├── public/         # Public assets and branding
├── dist/           # Production build output
├── tests/          # Unit, integration & E2E tests
├── package.json    # Project dependencies and scripts
└── README.md       # Project documentation
```

### 📂 Directory Overview

| Directory     | Purpose                                                                      |
| ------------- | ---------------------------------------------------------------------------- |
| **frontend/** | React, TypeScript, dashboards, components, themes, routing and role-based UI |
| **backend/**  | Express APIs, authentication, authorization, services and business logic     |
| **database/** | SQLite database, migrations, seed data and test database                     |
| **docs/**     | Architecture documentation, specifications and dashboard screenshots         |
| **public/**   | Logos, icons and static public assets                                        |
| **dist/**     | Production-ready frontend build                                              |
| **tests/**    | Unit, integration, authentication, RBAC and E2E tests                        |

The repository follows a modular full-stack architecture separating the **frontend presentation layer, backend API/business layer, database persistence layer, documentation, testing and production assets**.

---

# 🛠️ Technology Stack

## Frontend

* React 18
* TypeScript
* Vite
* React Router
* Redux Toolkit
* TanStack React Query
* Material UI
* Tailwind CSS
* Recharts
* WebSocket / Socket.IO
* Vitest

## Backend

* Node.js
* Express.js
* JWT
* Refresh Tokens
* Bcrypt
* REST APIs
* WebSocket
* Middleware-based authorization

## Database

* SQLite
* SQL migrations
* Seed data
* Foreign-key relationships
* Unique constraints
* Indexed queries
* Transaction-based operations

## Testing

* Vitest
* React Testing Library
* API/integration tests
* RBAC tests
* Authentication tests
* Attendance tests
* Database tests

---

# 🔐 Authentication & Authorization

The authentication architecture follows:

```text
Login
  ↓
Credentials Validation
  ↓
Password Verification
  ↓
MFA / OTP Challenge
  ↓
Access Token + Refresh Token
  ↓
Protected Route
  ↓
Role Validation
  ↓
Permission Validation
  ↓
Organization / Department / Team Scope
  ↓
Dashboard
```

### Security Features

* Password hashing with Bcrypt
* JWT access tokens
* Refresh tokens
* Token expiration
* MFA / OTP verification
* Protected routes
* Role guards
* Permission guards
* Scope-based authorization
* Session validation
* Logout/token invalidation
* Rate limiting
* API validation
* Audit logging

---

# 🛡️ Access Control

The platform supports multiple authorization layers.

### RBAC

```text
ADMIN
HR
MANAGER
TEAM_LEAD
EMPLOYEE
```

### ABAC

Access can additionally depend on:

```text
Organization
Department
Team
Employee
Resource
Action
User attributes
```

### Scope Model

```text
ADMIN
 └── Organization

HR
 └── Organization / HR Scope

MANAGER
 └── Department / Team

TEAM_LEAD
 └── Team

EMPLOYEE
 └── Self
```

---

# 👥 Employee Management

The system contains **250 unique seeded employee records**.

Employee IDs follow the format:

```text
EMP-001
EMP-002
EMP-003
...
EMP-250
```

The database enforces uniqueness using:

```sql
UNIQUE(emp_id)
```

Duplicate employee IDs are therefore rejected at the database level.

---

# 📋 Employee Table

The employee directory includes:

| Employee ID | Employee Name | Department | Designation | Employment Status | Email | Phone | Location | Joining Date | Manager | Attendance Status | Actions |
| ----------- | ------------- | ---------- | ----------- | ----------------- | ----- | ----- | -------- | ------------ | ------- | ----------------- | ------- |

The table supports:

* Search
* Sorting
* Filtering
* Pagination
* Employee details
* Status indicators
* Department filtering
* Role/designation filtering
* Attendance status
* CSV export
* View/edit actions

---

# 📊 Workforce Analytics

The platform provides reusable chart components with:

* Loading states
* Empty states
* Error states
* Responsive layouts
* Theme-aware styling
* API-driven data

### Analytics Included

* Employee growth
* Hiring trends
* Attendance trends
* Department comparison
* Workforce distribution
* Employment status
* Role distribution
* Location distribution
* Performance analytics
* Workforce trends

---

# ⏱️ Attendance Management

Employees can perform:

```text
Check-In
   ↓
Break
   ↓
Resume
   ↓
Check-Out
```

Additional functionality includes:

* Attendance history
* Attendance corrections
* Duplicate punch prevention
* Idempotent attendance actions
* Attendance status
* Offline queue
* Synchronization
* Manager/team monitoring
* Audit history

---

# 📍 Geofencing

Attendance verification supports location-based validation.

```text
Employee Location
       ↓
Distance Calculation
       ↓
MAHE Office Geofence
       ↓
Within Allowed Radius?
      / \
    YES  NO
     ↓    ↓
 Check-In  Reject / Alert
```

Geofence violations can trigger security notifications and audit events.

---

# 🔄 Offline Synchronization

Attendance actions can be queued locally when network connectivity is unavailable.

```text
Offline Action
      ↓
Local Queue
      ↓
Network Restored
      ↓
Synchronization
      ↓
Backend Validation
      ↓
SQLite Persistence
```

This prevents attendance actions from being lost during temporary connectivity problems.

---

# 🔔 Notifications & Alerts

The platform supports:

* Attendance notifications
* Security alerts
* Geofence alerts
* Duplicate punch alerts
* System notifications
* Notification history
* Real-time notification updates

---

# 🧾 Audit Logging

Important actions are recorded for traceability, including:

* Login
* Logout
* Authentication failures
* Employee changes
* Attendance actions
* Attendance corrections
* Permission-sensitive actions
* Geofence violations
* Security events

---

# 🗄️ Database

The project uses SQLite for local relational persistence.

```text
database/
│
├── wfa.db
├── wfa-test-e2e.db
│
├── migrations/
│   ├── 001_create_organizations.sql
│   ├── 002_create_users.sql
│   ├── 003_create_roles.sql
│   ├── 004_create_permissions.sql
│   ├── 005_create_employees.sql
│   ├── 006_create_departments.sql
│   ├── 007_create_teams.sql
│   ├── 008_create_attendance.sql
│   ├── 009_create_notifications.sql
│   └── 010_create_audit_logs.sql
│
└── seeds/
    ├── roles.sql
    ├── permissions.sql
    ├── users.sql
    ├── departments.sql
    ├── teams.sql
    └── employees.sql
```

---

# 🔑 Default Seeded Credentials

> **Development/testing credentials only. Do not use these passwords in production.**

| Role                      | Email                     | Password      | Dashboard              |
| ------------------------- | ------------------------- | ------------- | ---------------------- |
| **System Administrator**  | `admin@thestackly.com`    | `password123` | `/admin/dashboard`     |
| **HR Operations Manager** | `hr@thestackly.com`       | `password123` | `/hr/dashboard`        |
| **Department Manager**    | `manager@thestackly.com`  | `password123` | `/manager/dashboard`   |
| **Operational Team Lead** | `lead@thestackly.com`     | `password123` | `/team-lead/dashboard` |
| **Employee Self-Service** | `employee@thestackly.com` | `password123` | `/employee/dashboard`  |

---

# 🎨 Theme System

All five role dashboards use the same enterprise design system while adapting content and permissions to the logged-in role.

Supported themes:

```text
Light Mode
Dark Mode
```

Theme-aware components include:

* Sidebar
* Header
* KPI cards
* Charts
* Tables
* Forms
* Modals
* Buttons
* Dashboard cards
* Navigation
* Employee directory

---

# 🧭 Role-Based Navigation

Each role receives only the navigation modules permitted for that role.

```text
ADMIN
├── Dashboard
├── Employees
├── Departments
├── Teams
├── Analytics
├── Users
├── Roles & Permissions
├── Audit Logs
└── Settings

HR
├── Dashboard
├── Employees
├── Attendance
├── Departments
├── Workforce Analytics
└── Notifications

MANAGER
├── Dashboard
├── My Team
├── Attendance
├── Team Analytics
└── Notifications

TEAM LEAD
├── Dashboard
├── Team
├── Attendance
├── Performance
└── Notifications

EMPLOYEE
├── Dashboard
├── My Attendance
├── My Profile
└── Notifications
```

---

# 🔌 API Architecture

The frontend communicates with the backend through REST APIs.

### Authentication

```text
POST /api/auth/login
POST /api/auth/verify-otp
POST /api/auth/refresh
POST /api/auth/logout
POST /api/auth/signup
POST /api/auth/forgot-password
```

### Employees

```text
GET    /api/employees
GET    /api/employees/:empId
POST   /api/employees
PUT    /api/employees/:empId
DELETE /api/employees/:empId
```

### Attendance

```text
POST /api/attendance/check-in
POST /api/attendance/break
POST /api/attendance/resume
POST /api/attendance/check-out
GET  /api/attendance/history
POST /api/attendance/correction
```

### Analytics

```text
GET /api/analytics/workforce
GET /api/analytics/employees
GET /api/analytics/attendance
GET /api/analytics/departments
GET /api/analytics/hiring
```

---

# ⚡ Real-Time Architecture

Real-time events are handled through the application's WebSocket layer.

```text
Employee Action
      ↓
REST API
      ↓
SQLite
      ↓
WebSocket Event
      ↓
Dashboard
      ↓
Live UI Update
```

Real-time events include:

* Attendance updates
* Notification updates
* Security alerts
* Workforce KPI updates

---

# 🧪 Testing

The project includes unit, integration, authentication, RBAC, and database tests.

Run:

```bash
npm run test
```

Example test areas:

```text
Authentication
RBAC
Permission Guards
Employee API
Duplicate Employee IDs
Attendance
Attendance Idempotency
Geofencing
Refresh Tokens
Analytics
Database Persistence
```

---

# 📥 Quick Start

### 1. Clone the repository

```bash
git clone <repository-url>
cd WFA-Rolebased-Architecture-main
```

### 2. Install dependencies

```bash
npm install
```

If frontend and backend have separate dependencies:

```bash
cd frontend
npm install

cd ../backend
npm install
```

### 3. Configure environment

Create the required `.env` files from `.env.example`.

Never commit production secrets.

### 4. Initialize the database

Run the database migration/seed commands configured in the project.

The development database should contain:

```text
250 unique employee records
5 role accounts
Departments
Teams
Permissions
Attendance data
```

### 5. Start development servers

```bash
npm run dev
```

### 6. Run tests

```bash
npm run test
```

### 7. Production build

```bash
npm run build
```

---

# ✅ Feature Classification

| Feature                      | Status        |
| ---------------------------- | ------------- |
| Five role dashboards         | ✅ Completed   |
| RBAC                         | ✅ Completed   |
| ABAC                         | ✅ Implemented |
| PBAC / policy authorization  | ✅ Implemented |
| Protected routes             | ✅ Completed   |
| Permission guards            | ✅ Completed   |
| JWT authentication           | ✅ Completed   |
| Refresh-token authentication | ✅ Completed   |
| MFA / OTP                    | ✅ Completed   |
| SQLite persistence           | ✅ Completed   |
| 250 seeded employees         | ✅ Completed   |
| Unique employee IDs          | ✅ Completed   |
| Employee table               | ✅ Completed   |
| Employee search/filter       | ✅ Completed   |
| Employee pagination          | ✅ Completed   |
| Dashboard analytics          | ✅ Completed   |
| Chart loading states         | ✅ Completed   |
| Chart empty states           | ✅ Completed   |
| Chart error states           | ✅ Completed   |
| Attendance actions           | ✅ Completed   |
| Attendance corrections       | ✅ Completed   |
| Offline synchronization      | ✅ Completed   |
| Attendance idempotency       | ✅ Completed   |
| Geofencing                   | ✅ Completed   |
| Audit logging                | ✅ Completed   |
| Notifications                | ✅ Completed   |
| Real-time updates            | ✅ Implemented |
| Light/Dark theme             | ✅ Completed   |
| Role-specific navigation     | ✅ Completed   |
| Responsive dashboard         | ✅ Completed   |
| CSV export                   | ✅ Completed   |
| Unit/integration tests       | ✅ Implemented |

---

# 🔍 End-to-End Security Flow

```text
Authentication
      ↓
User Profile
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
Protected Route
      ↓
Sidebar Authorization
      ↓
Dashboard
      ↓
API Request
      ↓
Backend Authorization
      ↓
Service Layer
      ↓
Repository Layer
      ↓
SQLite
      ↓
Audit Log
```

---

# 📌 Production Readiness Checklist

* [x] React + TypeScript frontend
* [x] Express backend
* [x] SQLite database
* [x] Five enterprise roles
* [x] RBAC
* [x] ABAC
* [x] Policy-based authorization
* [x] JWT authentication
* [x] Refresh-token flow
* [x] MFA/OTP
* [x] Password hashing
* [x] Protected routes
* [x] API authorization
* [x] 250 unique employees
* [x] Duplicate employee ID prevention
* [x] Attendance management
* [x] Offline synchronization
* [x] Geofencing
* [x] Audit logging
* [x] Analytics
* [x] Real-time updates
* [x] Responsive UI
* [x] Light/Dark themes
* [x] Role-specific dashboards
* [x] Employee management
* [x] Automated tests

---

# 📂 Dashboard Screenshot Convention

When updating dashboard screenshots, keep the following structure:

```text
docs/
└── screenshots/
    ├── admin-dashboard.png
    ├── hr-dashboard.png
    ├── manager-dashboard.png
    ├── team-lead-dashboard.png
    └── employee-dashboard.png
```

Screenshots should show the **actual application running with the corresponding role logged in**, rather than mockups.

---

# 🏢 Enterprise Workforce Analytics

The platform is designed as a scalable foundation for workforce intelligence, combining secure identity management, role-aware dashboards, employee analytics, attendance intelligence, real-time operational monitoring, and enterprise authorization into a single full-stack application.

**Architecture:** React + TypeScript + Node.js + Express + SQLite

**Security:** RBAC + ABAC + Policy-Based Authorization + JWT + MFA

**Analytics:** Workforce + Attendance + Employee + Department Intelligence

**Data:** SQLite + 250 seeded unique employees

**Real-Time:** Attendance + Notifications + Dashboard Updates
