# Enterprise Workforce Analytics Intelligence Platform

An enterprise-grade **Workforce Analytics and Intelligence Platform** built with a unified full-stack architecture using **React 18, TypeScript, Node.js, Express.js, MongoDB, Redux Toolkit, TanStack React Query, Material UI, Tailwind CSS, Recharts, and real-time communication technologies**.

The platform provides secure workforce management, workforce intelligence, attendance monitoring, employee management, analytics, and enterprise authorization through **RBAC, ABAC, policy-based authorization, JWT authentication, refresh tokens, and Multi-Factor Authentication (MFA)**.

---

## 🚀 Platform Overview

The Workforce Analytics Intelligence Platform provides:

* 🔐 Five-tier enterprise role architecture
* 🛡️ RBAC — Role-Based Access Control
* 🔎 ABAC — Attribute-Based Access Control
* 📜 Policy-Based Access Control
* 🔑 JWT authentication
* 🔄 Refresh-token authentication
* 🔐 Multi-Factor Authentication (MFA)
* 📱 OTP verification
* 👥 250 uniquely seeded employee records
* 🚫 Duplicate employee ID prevention
* 📊 Workforce analytics
* 📈 Employee growth and hiring analytics
* 🏢 Department analytics
* 👤 Employee management
* 📋 Searchable and filterable employee directory
* 📄 Employee pagination
* 📤 CSV export
* ⏱️ Attendance management
* 🟢 Check-In / Check-Out
* ☕ Break / Resume
* 📝 Attendance corrections
* 🔄 Offline attendance synchronization
* 📍 Geofencing and attendance verification
* 🚨 Security and geofence alerts
* 🔔 Notifications
* 📧 Company email notification support
* 💬 System/message notifications
* ⚡ Real-time attendance updates
* ⚡ Real-time notification updates
* 🧾 Audit logging
* 🔒 Protected routes
* 🛡️ Role guards
* 🔏 Permission guards
* 🎨 Consistent enterprise theme across all roles
* 🌓 Light and dark mode
* 📱 Responsive dashboard layout
* 📊 Reusable chart components
* ⏳ Loading states
* 📭 Empty states
* ❌ Error states
* 🧪 Unit and integration testing
* 🗄️ MongoDB persistence
* 🔗 REST API integration

---

# 👥 Five Role Architecture

The platform supports five enterprise roles.

| Role          | Access Scope                | Dashboard              |
| ------------- | --------------------------- | ---------------------- |
| **ADMIN**     | Organization-wide           | `/admin/dashboard`     |
| **HR**        | Workforce and HR operations | `/hr/dashboard`        |
| **MANAGER**   | Department/team management  | `/manager/dashboard`   |
| **TEAM LEAD** | Team-level operations       | `/team-lead/dashboard` |
| **EMPLOYEE**  | Personal/self-service       | `/employee/dashboard`  |

Each role receives:

* Role-specific dashboard
* Authorized sidebar navigation
* Authorized API access
* Role-specific widgets
* Role-specific analytics
* Role-specific data scope
* Role-specific actions
* Permission-aware UI
* Theme-consistent interface

---

# 📊 Role Dashboards

## 🔴 Admin Dashboard

The Admin dashboard provides organization-wide visibility and administrative control.

Key capabilities include:

* Organization workforce overview
* Employee management
* User management
* Role and permission management
* Department management
* Team management
* Workforce analytics
* Attendance analytics
* Audit logs
* Security events
* System notifications
* Administrative settings

---

## 🟣 HR Dashboard

The HR dashboard focuses on workforce and human-resource operations.

Key capabilities include:

* Workforce overview
* Employee management
* Employee directory
* Department analytics
* Hiring analytics
* Attendance analytics
* Workforce trends
* Employee status
* HR notifications
* Employee information management

---

## 🔵 Manager Dashboard

The Manager dashboard focuses on department and team-level workforce intelligence.

Key capabilities include:

* Team overview
* Department workforce statistics
* Team attendance
* Employee performance
* Workforce analytics
* Attendance trends
* Team employee directory
* Team notifications
* Department-level filtering

---

## 🟢 Team Lead Dashboard

The Team Lead dashboard provides operational team-level visibility.

Key capabilities include:

* Team members
* Team attendance
* Check-in/check-out monitoring
* Team performance
* Employee status
* Attendance history
* Team analytics
* Operational notifications

---

## 🟠 Employee Dashboard

The Employee dashboard provides self-service workforce functionality.

Key capabilities include:

* Personal dashboard
* My profile
* My attendance
* Check-In
* Break
* Resume
* Check-Out
* Attendance history
* Attendance correction requests
* Notifications
* Personal workforce information

---

# 🏗️ Project Architecture

## 📁 Repository Structure

```text
WFA-Rolebased-Architecture/
│
├── frontend/       # React + TypeScript application
├── backend/        # Node.js + Express REST API
├── database/       # MongoDB documentation, schemas, and configurations
├── docs/           # Documentation and architecture specifications
├── public/         # Public assets, logos and icons
├── dist/           # Production build output
├── tests/          # Unit, integration and E2E tests
├── package.json    # Project dependencies and scripts
└── README.md       # Project documentation
```

### Directory Overview

| Directory     | Purpose                                                                      |
| ------------- | ---------------------------------------------------------------------------- |
| **frontend/** | React, TypeScript, dashboards, components, themes, routing and role-based UI |
| **backend/**  | Express APIs, authentication, authorization, services and business logic     |
| **database/** | MongoDB database models design, schemas, configurations, and documentation    |
| **docs/**     | Architecture documentation and project specifications                        |
| **public/**   | Logos, icons and static public assets                                        |
| **dist/**     | Production-ready frontend build                                              |
| **tests/**    | Unit, integration, authentication, RBAC and E2E tests                        |

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
* React Testing Library

## Backend

* Node.js
* Express.js
* JWT
* Refresh Tokens
* Bcrypt
* REST APIs
* WebSocket / Socket.IO
* Middleware-based authorization
* Request validation
* Security middleware

## Database

* MongoDB (via Mongoose ODM)
* Dynamic data seeding
* Unique index constraints (e.g., employee code, user email)
* Index-based query optimizations
* MongoMemoryServer in-memory replica set for dev fallback
* Audit log persistence collection

---

# 🔐 Authentication & MFA

The platform implements a multi-layer authentication architecture.

```text
Login
  ↓
Credentials Validation
  ↓
Password Verification
  ↓
MFA / OTP Challenge
  ↓
OTP Verification
  ↓
Access Token + Refresh Token
  ↓
Protected Route
  ↓
Role Validation
  ↓
Permission Validation
  ↓
Scope Validation
  ↓
Role Dashboard
```

### Authentication Features

* JWT access tokens
* Refresh tokens
* Multi-Factor Authentication
* OTP verification
* MFA challenge management
* Password hashing with Bcrypt
* Token expiration
* Session validation
* Logout
* Token invalidation
* Protected routes
* Authentication error handling
* Rate limiting
* API validation
* Authentication audit logs

### MFA Flow

```text
User Login
    ↓
Username / Email + Password
    ↓
Credentials Valid?
   / \
 NO   YES
 ↓     ↓
Reject  Generate MFA/OTP Challenge
              ↓
         OTP Verification
              ↓
        OTP Valid / Invalid
          /          \
       Invalid       Valid
         ↓             ↓
      Reject      Issue Tokens
                        ↓
                 Access Dashboard
```

MFA provides an additional authentication layer before issuing the authenticated session.

---

# 🛡️ Access Control

## RBAC

```text
ADMIN
HR
MANAGER
TEAM_LEAD
EMPLOYEE
```

## ABAC

Access can additionally depend on:

```text
Organization
Department
Team
Employee
Resource
Action
User Attributes
```

## Policy-Based Authorization

Policies evaluate:

```text
User
 +
Role
 +
Permission
 +
Resource
 +
Action
 +
Scope
 =
Access Decision
```

---

# 🎯 Scope-Based Authorization

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

This ensures users cannot access workforce data outside their authorized organizational scope.

---

# 👥 Employee Management

The platform contains **250 uniquely seeded employee records**.

Employee IDs follow:

```text
EMP-001
EMP-002
EMP-003
...
EMP-250
```

The database enforces uniqueness through:

```sql
UNIQUE(emp_id)
```

This prevents duplicate employee IDs at the database level.

### Employee Management Features

* Create employee
* View employee
* Update employee
* Employee details
* Employee status
* Department assignment
* Team assignment
* Manager assignment
* Search
* Filtering
* Sorting
* Pagination
* Attendance status
* CSV export
* Duplicate ID prevention

---

# 📋 Employee Directory

The employee table contains:

| Employee ID | Employee Name | Department | Designation | Employment Status | Email | Phone | Location | Joining Date | Manager | Attendance Status | Actions |
| ----------- | ------------- | ---------- | ----------- | ----------------- | ----- | ----- | -------- | ------------ | ------- | ----------------- | ------- |

### Employee Table Features

* 🔎 Global search
* ↕️ Column sorting
* 🔍 Department filtering
* 🔍 Role/designation filtering
* 🔍 Employment-status filtering
* 📄 Pagination
* 👤 Employee details
* 🟢 Attendance status
* ✏️ Edit actions
* 👁️ View actions
* 📤 CSV export
* 🚫 Duplicate employee ID validation

---

# 📊 Workforce Analytics

The platform provides reusable, API-driven analytics components.

### Analytics

* Employee growth
* Hiring trends
* Workforce trends
* Attendance trends
* Department comparison
* Workforce distribution
* Employment status
* Role distribution
* Location distribution
* Performance analytics
* Employee statistics

### Chart States

Every reusable chart supports:

```text
Loading
   ↓
Data Available
   OR
Empty
   OR
Error
```

Charts are responsive and theme-aware.

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

### Attendance Features

* Check-In
* Break
* Resume
* Check-Out
* Attendance history
* Attendance status
* Attendance corrections
* Duplicate punch prevention
* Idempotent actions
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
Office Geofence
       ↓
Within Allowed Radius?
      / \
    YES  NO
     ↓    ↓
 Check-In  Reject / Alert
```

Geofence violations can generate:

* Security alerts
* Notifications
* Audit events
* Attendance rejection

---

# 🔄 Offline Attendance Synchronization

When network connectivity is unavailable:

```text
Attendance Action
      ↓
Local Queue
      ↓
Network Restored
      ↓
Synchronization
      ↓
Backend Validation
      ↓
MongoDB Persistence
      ↓
Real-Time Update
```

This allows attendance actions to be preserved during temporary connectivity issues.

---

# 🔔 Notifications, Email & Messages

The platform supports workforce notifications and security communication.

### Notification Types

* Attendance notifications
* Check-in notifications
* Check-out notifications
* Attendance correction notifications
* Geofence alerts
* Duplicate punch alerts
* Security alerts
* System notifications
* Workforce notifications

### Communication

Notifications can be delivered through dynamic enterprise communication channels, including:

* 📧 Official company email
* 💬 In-application messages
* 🔔 Real-time system notifications

**Company communication only:** Personal email addresses should not be used for project communication, notification configuration, or repository documentation.

Company email configuration should be supplied through environment variables rather than hard-coded into the source code.

Example:

```env
COMPANY_EMAIL=
COMPANY_EMAIL_HOST=
COMPANY_EMAIL_PORT=
COMPANY_EMAIL_USER=
COMPANY_EMAIL_PASSWORD=
```

Sensitive credentials must never be committed to Git.

---

# ⚡ Real-Time Architecture

Real-time events are handled through the application's WebSocket layer.

```text
Employee Action
      ↓
REST API
      ↓
Backend Service
      ↓
MongoDB
      ↓
WebSocket Event
      ↓
Dashboard
      ↓
Live UI Update
```

Real-time functionality includes:

* Attendance updates
* Notification updates
* Security alerts
* Workforce KPI updates
* Employee status updates

---

# 🧾 Audit Logging

Important platform activities are recorded for traceability.

### Audited Events

* Login
* Logout
* Failed authentication
* MFA verification
* Token refresh
* Employee creation
* Employee updates
* Employee deletion
* Attendance actions
* Attendance corrections
* Permission-sensitive actions
* Geofence violations
* Security events
* Administrative actions

---

# 🎨 Enterprise Theme System

All five roles use the same enterprise design system.

The interface adapts content and permissions based on the authenticated role while maintaining visual consistency.

### Supported Themes

```text
Light Mode
Dark Mode
```

### Theme-Aware Components

* Sidebar
* Header
* KPI cards
* Charts
* Tables
* Forms
* Buttons
* Modals
* Navigation
* Employee directory
* Attendance interface
* Dashboard cards

Theme changes apply consistently across all five roles.

---

# 🧭 Role-Based Navigation

## ADMIN

```text
Dashboard
Employees
Departments
Teams
Analytics
Users
Roles & Permissions
Audit Logs
Settings
```

## HR

```text
Dashboard
Employees
Attendance
Departments
Workforce Analytics
Notifications
```

## MANAGER

```text
Dashboard
My Team
Attendance
Team Analytics
Notifications
```

## TEAM LEAD

```text
Dashboard
Team
Attendance
Performance
Notifications
```

## EMPLOYEE

```text
Dashboard
My Attendance
My Profile
Notifications
```

---

# 🔌 REST API Architecture

## Authentication

```text
POST /api/auth/login
POST /api/auth/verify-otp
POST /api/auth/refresh
POST /api/auth/logout
POST /api/auth/signup
POST /api/auth/forgot-password
```

## Employees

```text
GET    /api/employees
GET    /api/employees/:empId
POST   /api/employees
PUT    /api/employees/:empId
DELETE /api/employees/:empId
```

## Attendance

```text
POST /api/attendance/check-in
POST /api/attendance/break
POST /api/attendance/resume
POST /api/attendance/check-out
GET  /api/attendance/history
POST /api/attendance/correction
```

## Analytics

```text
GET /api/analytics/workforce
GET /api/analytics/employees
GET /api/analytics/attendance
GET /api/analytics/departments
GET /api/analytics/hiring
```

---

# 🗄️ Database

The platform uses MongoDB for data persistence.

Core data domains include:

```text
Organizations
Users
Roles
Permissions
Employees
Departments
Teams
Attendance
Attendance Corrections
Notifications
MFA Challenges
Audit Logs
Sessions / Refresh Tokens
```

Database requirements include:

* **Unique Employee IDs**: Enforced via `employeeCode TEXT UNIQUE` database constraints.
* **Unique User Emails**: Enforced via `email TEXT UNIQUE` database constraints.
* **Foreign-Key Relationships**: Validated across organizations, users, employees, departments, and teams.
* **Indexed Queries**: Optimized performance with indexes on critical query paths.
* **Transaction Support**: Clean schema creation and seeding transaction rollbacks on failure.
* **Test Database**: Separation of test state to prevent development DB pollution.
* **Audit Persistence**: Automatic tracking of system login/logout, check-ins/outs, and corrections.

### 👥 250 Stackly Employee Seed Dataset

The project seeds exactly **250 employee records** distributed deterministically across various offices:

| Location | Number of Employees | Continuous ID Range |
| --- | --- | --- |
| **Hyderabad** | 70 employees | `STK-YYYY-0001` to `STK-YYYY-0070` |
| **Visakhapatnam** | 40 employees | `STK-YYYY-0071` to `STK-YYYY-0110` |
| **Chennai** | 50 employees | `STK-YYYY-0111` to `STK-YYYY-0160` |
| **Bengaluru** | 60 employees | `STK-YYYY-0161` to `STK-YYYY-0220` |
| **Kochi** | 30 employees | `STK-YYYY-0221` to `STK-YYYY-0250` |
| **TOTAL** | **250 employees** | **0001–0250** |

#### Rules and Conventions:
* **Employee ID format**: `STK-{YEAR_OF_JOINING}-{CONTINUOUS_4_DIGIT_NUMBER}` (e.g. `STK-2022-0001`). The continuous sequence is globally unique and location-independent.
* **Email format**: `firstname.lastname.NNNN@thestackly.com` (lowercase) where `NNNN` corresponds to the unique 4-digit sequence, ensuring deterministic email uniqueness.
* **Compatibility**: Employee `0250` corresponds to `usr-emp-01` (`Alex Mercer`, `employee@thestackly.com`) to preserve login compatibility for e2e tests.


---

# 🔑 Default Seeded Credentials

> **Development/testing credentials only. Never use these passwords in production.**

| Role                      | Company Email             | Password      | Dashboard              |
| ------------------------- | ------------------------- | ------------- | ---------------------- |
| **System Administrator**  | `admin@thestackly.com`    | `password123` | `/admin/dashboard`     |
| **HR Operations Manager** | `hr@thestackly.com`       | `password123` | `/hr/dashboard`        |
| **Department Manager**    | `manager@thestackly.com`  | `password123` | `/manager/dashboard`   |
| **Operational Team Lead** | `lead@thestackly.com`     | `password123` | `/team-lead/dashboard` |
| **Employee Self-Service** | `employee@thestackly.com` | `password123` | `/employee/dashboard`  |

These credentials are intended strictly for development and testing.

---

# 🧪 Testing

The project includes:

* Unit tests
* Integration tests
* Authentication tests
* MFA tests
* OTP tests
* RBAC tests
* Permission tests
* Employee API tests
* Database tests
* Attendance tests
* Geofencing tests
* Refresh-token tests
* Analytics tests
* Idempotency tests

Run:

```bash
npm run test
```

---

# 📥 Getting Started

## 1. Clone the Repository

```bash
git clone https://github.com/maheswari-pinneti/WFA-Rolebased-Architecture.git
cd WFA-Rolebased-Architecture
```

## 2. Install Dependencies

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

## 3. Configure Environment

Create the environment file from the provided example:

```bash
cp .env.example .env
```

Configure company/service credentials only through environment variables in `.env`.

> [!NOTE]
> **Zero-Config Database Fallback**: In development (`NODE_ENV=development`), you can leave `MONGODB_URI` blank or omit it from `.env`. The backend will automatically start an in-memory MongoDB replica set using `mongodb-memory-server` and seed it automatically on startup.

Do not add:
* Personal credentials or passwords
* Real production JWT secrets
* Production Database URLs or API keys
to the Git repository.

## 4. Initialize Database (Automatic for Fallback)

Run the configured migration and seed commands.

The development database should contain:

```text
250 unique employees
5 role accounts
Departments
Teams
Permissions
MFA configuration
Attendance data
Notification data
Audit records
```

## 5. Start Development

```bash
npm run dev
```

## 6. Run Tests

```bash
npm run test
```

## 7. Build Production Version

```bash
npm run build
```

---

# 🔀 Git Workflow

The project follows structured Git practices for development and maintenance.

### Check Repository Status

```bash
git status
```

### Check Changed Files

```bash
git diff
```

### Add Changes

```bash
git add .
```

### Commit Changes

```bash
git commit -m "feat: complete workforce analytics security and data integration"
```

### Push Changes

```bash
git push origin main
```

### Pull Latest Changes

```bash
git pull origin main
```

### Useful Commit Categories

```text
feat     → New functionality
fix      → Bug fixes
refactor → Code restructuring
style    → UI/theme changes
security → Security improvements
data     → Database/seed changes
test     → Testing changes
docs     → Documentation changes
chore    → Configuration/dependency changes
```

Example:

```bash
git commit -m "feat: add MFA refresh token and seeded employee integration"
```

---

# 🛠️ Development Improvements

The project includes continuous improvements across:

* Missing file resolution
* Build error fixes
* TypeScript error fixes
* API integration
* Database integration
* Employee seed data
* Duplicate employee validation
* Employee table improvements
* Theme consistency
* Sidebar and layout corrections
* Logo and branding corrections
* Authentication improvements
* MFA integration
* Refresh-token support
* Notification integration
* Real-time updates
* Attendance synchronization
* Security improvements
* Responsive UI fixes
* Testing improvements

---

# ✅ Feature Classification

| Feature                               | Status          |
| ------------------------------------- | --------------- |
| Five role dashboards                  | ✅ Completed     |
| RBAC                                  | ✅ Completed     |
| ABAC                                  | ✅ Implemented   |
| Policy-based authorization            | ✅ Implemented   |
| Protected routes                      | ✅ Completed     |
| Permission guards                     | ✅ Completed     |
| JWT authentication                    | ✅ Completed     |
| Refresh-token authentication          | ✅ Completed     |
| **Multi-Factor Authentication (MFA)** | ✅ **Completed** |
| **OTP verification**                  | ✅ **Completed** |
| MFA challenge management              | ✅ Completed     |
| MongoDB persistence                   | ✅ Completed     |
| 250 seeded employees                  | ✅ Completed     |
| Unique employee IDs                   | ✅ Completed     |
| Duplicate ID prevention               | ✅ Completed     |
| Employee table                        | ✅ Completed     |
| Employee search/filter                | ✅ Completed     |
| Employee pagination                   | ✅ Completed     |
| CSV export                            | ✅ Completed     |
| Dashboard analytics                   | ✅ Completed     |
| Chart loading states                  | ✅ Completed     |
| Chart empty states                    | ✅ Completed     |
| Chart error states                    | ✅ Completed     |
| Attendance actions                    | ✅ Completed     |
| Attendance corrections                | ✅ Completed     |
| Offline synchronization               | ✅ Completed     |
| Attendance idempotency                | ✅ Completed     |
| Geofencing                            | ✅ Completed     |
| Audit logging                         | ✅ Completed     |
| Notifications                         | ✅ Completed     |
| Company email notifications           | ✅ Implemented   |
| In-app messaging                      | ✅ Implemented   |
| Real-time updates                     | ✅ Implemented   |
| Light/Dark theme                      | ✅ Completed     |
| Role-specific navigation              | ✅ Completed     |
| Responsive dashboard                  | ✅ Completed     |
| Unit/integration tests                | ✅ Implemented   |

---

# 🔍 End-to-End Security Flow

```text
Authentication
      ↓
Credentials Validation
      ↓
Password Verification
      ↓
MFA / OTP Verification
      ↓
Access Token + Refresh Token
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
Database
      ↓
Audit Log
      ↓
Notification / Real-Time Event
```

---

# 📌 Production Readiness Checklist

* [x] React + TypeScript frontend
* [x] Node.js + Express backend
* [x] MongoDB database
* [x] Five enterprise roles
* [x] RBAC
* [x] ABAC
* [x] Policy-based authorization
* [x] JWT authentication
* [x] Refresh-token flow
* [x] MFA
* [x] OTP verification
* [x] Password hashing
* [x] Protected routes
* [x] Permission guards
* [x] API authorization
* [x] 250 unique employees
* [x] Duplicate employee ID prevention
* [x] Employee management
* [x] Employee search and filtering
* [x] Employee pagination
* [x] CSV export
* [x] Attendance management
* [x] Attendance corrections
* [x] Offline synchronization
* [x] Geofencing
* [x] Audit logging
* [x] Notifications
* [x] Company email notification support
* [x] In-app messaging
* [x] Real-time updates
* [x] Workforce analytics
* [x] Responsive UI
* [x] Light/Dark themes
* [x] Role-specific dashboards
* [x] Automated tests
* [x] Git-based development workflow

---

# 👩‍💻 Project Author & Contribution

## Maheswari Pinneti

**Frontend Developer — Stackly**

### Key Contributions

* React and TypeScript application development
* Five role-based dashboard implementation
* Responsive enterprise UI development
* Role-based navigation
* Protected routes
* RBAC-aware frontend architecture
* Permission-based UI controls
* Light/Dark theme implementation across all five roles
* Sidebar and header implementation
* Enterprise layout improvements
* Logo and company branding integration
* Employee management interface
* Employee table implementation
* Search, filtering and pagination
* 250 seeded employee data integration
* Duplicate employee ID prevention integration
* Workforce analytics visualization
* Reusable KPI and chart components
* Chart loading, empty and error states
* Attendance UI and workflows
* Geofencing attendance interface
* Offline attendance synchronization
* REST API integration
* JWT authentication integration
* **Multi-Factor Authentication (MFA) integration**
* **OTP verification flow**
* **Refresh-token authentication integration**
* Authentication/session handling
* Permission and authorization guards
* Notification integration
* Real-time dashboard updates
* Company email/message notification integration
* CSV export functionality
* Frontend testing
* Authentication and RBAC testing
* Build-error resolution
* TypeScript error resolution
* UI bug fixing
* Responsive layout corrections
* Production UI refinement
* Git-based feature development and maintenance

---

# 🏢 Enterprise Workforce Intelligence

The Workforce Analytics Intelligence Platform combines:

**Secure Authentication**

JWT + Refresh Tokens + MFA + OTP

**Enterprise Authorization**

RBAC + ABAC + Policy-Based Access Control

**Workforce Intelligence**

Employee + Workforce + Department + Attendance Analytics

**Attendance Intelligence**

Check-In + Break + Resume + Check-Out + Corrections + Geofencing

**Data Management**

MongoDB + 250 Unique Employees + Duplicate Prevention

**Real-Time Operations**

Attendance + Notifications + Messages + Workforce Updates

**Enterprise UI**

Five Role Dashboards + Responsive Layout + Light/Dark Themes

**Quality**

Unit Tests + Integration Tests + Security Validation + Database Tests

---

## 👩‍💻 Developed By

**Maheswari Pinneti**
**Frontend Developer — Stackly**

**Project:** Enterprise Workforce Analytics Intelligence Platform

**Repository:** `WFA-Rolebased-Architecture`

**Communication:** Official company/Stackly communication channels only.
