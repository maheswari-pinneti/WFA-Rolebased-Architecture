# WORKFORCE ANALYTICS DASHBOARD
## Comprehensive Enterprise Architecture & Technical Specifications

**Author:** Principal Solution Architect & Enterprise UI/UX Lead  
**Platform:** Stackly Workforce Analytics Intelligence Platform  
**Architecture Standard:** N-Tier, Domain-Driven Design (DDD), MVP (Model-View-Presenter), Repository Pattern, SOLID Principles  

---

## 1. Enterprise System Architecture

The **Stackly Workforce Analytics Platform** is an enterprise-grade workforce intelligence ecosystem designed for multi-tenant, role-based corporate operations. It enforces high availability, zero-trust security boundaries, and 5-layer separation of concerns.

```mermaid
flowchart TD
    subgraph CLIENT["Presentation Layer (View)"]
        UI_AUTH["Authentication & MFA Portal"]
        UI_DASH["Executive & Department Dashboards"]
        UI_NAV["Fixed Header & Dynamic Sidebar"]
        UI_ANALYTICS["Recharts Visualization Engine"]
    end

    subgraph PRESENTER["Presenter Layer (UI Orchestration)"]
        P_AUTH["AuthPresenter"]
        P_DASH["DashboardPresenter"]
        P_EMP["EmployeePresenter"]
        P_ATT["AttendancePresenter"]
        P_PERF["PerformancePresenter"]
        P_REP["ReportsPresenter"]
    end

    subgraph DOMAIN["Business / Domain Layer (DDD Services)"]
        S_AUTH["AuthenticationService"]
        S_EMP["EmployeeService"]
        S_ATT["AttendanceService"]
        S_PERF["PerformanceService"]
        S_PAY["PayrollService"]
        S_SEC["PermissionService (RBAC/DBAC/PBAC)"]
    end

    subgraph REPO["Persistence Layer (Repositories)"]
        R_USER["UserRepository"]
        R_EMP["EmployeeRepository"]
        R_ATT["AttendanceRepository"]
        R_PERF["PerformanceRepository"]
        R_AUDIT["AuditLogRepository"]
    end

    subgraph DB["Database Layer (Normalized RDBMS)"]
        DB_PG[("PostgreSQL Enterprise DB")]
        CACHE_REDIS[("Redis Distributed Cache")]
    end

    CLIENT --> PRESENTER
    PRESENTER --> DOMAIN
    DOMAIN --> REPO
    REPO --> DB_PG
    REPO --> CACHE_REDIS
```

---

## 2. N-Tier Architecture Diagram

```mermaid
flowchart LR
    Tier1["Tier 1: Presentation Layer\n(React 19 + Vite + MUI + Tailwind CSS)"]
    Tier2["Tier 2: Presenter / Application Layer\n(UI State Orchestration + Validation)"]
    Tier3["Tier 3: Business Logic Layer\n(Domain Services + Approval Workflows)"]
    Tier4["Tier 4: Persistence Layer\n(Repository Pattern + Cache Layer)"]
    Tier5["Tier 5: Database Layer\n(PostgreSQL RDBMS + Audit Event Bus)"]

    Tier1 <-->|HTTP REST / WebSockets| Tier2
    Tier2 <-->|DTO Invocations| Tier3
    Tier3 <-->|Domain Entities| Tier4
    Tier4 <-->|SQL Queries / ORM| Tier5
```

---

## 3. MVP Architecture Diagram (Model-View-Presenter)

```mermaid
flowchart TD
    subgraph VIEW["VIEW (Presentation Components)"]
        V_COMP["React Components (Header, Sidebar, Dashboards)"]
        V_EVENT["User Events (Clicks, Inputs, Filters)"]
    end

    subgraph PRESENTER["PRESENTER (State & Orchestration)"]
        P_STATE["UI State Management (Redux Toolkit)"]
        P_VAL["Input Validation & Formatting"]
        P_NAV["Navigation & Routing Handlers"]
    end

    subgraph MODEL["MODEL (Business Services & Repositories)"]
        M_BUS["Business Domain Services"]
        M_ENT["Entity Models & DTOs"]
        M_API["Axios API Client"]
    end

    V_EVENT -->|Triggers UI Action| PRESENTER
    PRESENTER -->|Updates UI State| V_COMP
    PRESENTER -->|Executes Business Method| MODEL
    MODEL -->|Returns Data DTO| PRESENTER
```

---

## 4. Domain-Driven Design Architecture (DDD)

The system is partitioned into explicit **Bounded Contexts**:
1. **Identity & Security Context**: User authentication, OTP verification, JWT token issuance, session clearance, RBAC/PBAC policy evaluation.
2. **Workforce Management Context**: Employee profile lifecycle, department structures, locations, reporting hierarchies, organization charts.
3. **Time & Attendance Context**: Daily clock-in/out records, shift schedules, remote WFH tracking, leave approvals.
4. **Performance & Talent Context**: Goal setting (KPIs/OKRs), quarterly performance reviews, rating calculations, talent risk assessment.
5. **Analytics & Governance Context**: Executive KPI rollups, custom report generation, export center, audit log streaming.

---

## 5. Frontend Architecture

Built on **React 19**, **TypeScript**, **Vite**, **Redux Toolkit**, and **Tailwind CSS**:

```text
src/
├── app/                  # Application initialization, Store, Providers & Routes
│   ├── providers/        # Redux, React Query, Theme Providers
│   ├── routes/           # Protected & Role-Guarded AppRoutes
│   └── store/            # Redux Toolkit store definition
├── auth/                 # Authentication domain (Hooks, Slices, Components)
│   ├── components/       # LoginForm, LogoutModal
│   ├── hooks/            # useAuth hook
│   ├── pages/            # LoginPage, LogoutPage
│   └── store/            # authSlice
├── business/             # Business Layer Domain Services (DDD)
│   ├── services/         # AuthService, EmployeeService, AttendanceService, etc.
│   └── validators/       # Domain business validators
├── components/           # Reusable Presentation UI Components
│   ├── cards/            # KPICard
│   ├── common/           # StacklyLogo, Badges
│   ├── header/           # Header, GlobalSearch, UserProfileMenu
│   ├── sidebar/          # Sidebar, RoleBasedMenu, UserProfile
│   └── tables/           # EmployeeTable, DataTable
├── design-system/        # Core theme tokens, color palettes, CSS variables
├── features/             # Feature Modules by Role & Domain
│   ├── admin/            # Admin Console, User & Role Management
│   ├── analytics/        # Recharts SVG charts (Growth, Distribution, Bar, Area)
│   ├── employee/         # Employee Portal, Profile, MyAttendance
│   ├── hr/               # HR Portal, Talent Pipeline, Attendance Management
│   └── manager/          # Manager Console, Approvals, Team Performance
├── persistence/          # Persistence Layer (Repository Implementation)
│   └── repositories/     # UserRepository, EmployeeRepository, AttendanceRepository
├── security/             # Security Layer (RBAC, DBAC, PBAC)
│   ├── audit/            # AuditLogger service
│   ├── guards/           # RoleGuard, PermissionGuard, ProtectedRoute
│   ├── permissions/      # Permission enum & definitions
│   └── roles/            # Role definitions & hierarchy
└── shared/               # Cross-cutting Utilities & Layout Shells
    ├── components/       # AdvancedFilterBar, DrillDownModal, SupportModal
    ├── layouts/          # MainLayout, EnterpriseHeader, Sidebar
    └── utils/            # Helper functions & formatters
```

---

## 6. Database ER Diagram

```mermaid
erDiagram
    USERS ||--o{ SESSIONS : has
    USERS ||--o{ REFRESH_TOKENS : owns
    USERS }|--|| ROLES : assigned
    USERS ||--o| EMPLOYEES : links
    EMPLOYEES }|--|| DEPARTMENTS : belongs_to
    EMPLOYEES }|--o| TEAMS : belongs_to
    ROLES ||--o{ ROLE_PERMISSIONS : contains
    PERMISSIONS ||--o{ ROLE_PERMISSIONS : maps
    EMPLOYEES ||--o{ ATTENDANCE : records
    EMPLOYEES ||--o{ PERFORMANCE : receives
    EMPLOYEES ||--o{ PAYROLL : paid
    USERS ||--o{ NOTIFICATIONS : receives
    USERS ||--o{ AUDIT_LOGS : generates

    USERS {
        uuid id PK
        string email UK
        string password_hash
        uuid role_id FK
        boolean is_active
        datetime created_at
    }

    EMPLOYEES {
        uuid id PK
        uuid user_id FK
        string employee_code UK
        string first_name
        string last_name
        uuid department_id FK
        uuid team_id FK
        string designation
        date join_date
    }

    ROLES {
        uuid id PK
        string name UK
        string description
    }

    PERMISSIONS {
        uuid id PK
        string code UK
        string module
    }

    DEPARTMENTS {
        uuid id PK
        string name UK
        string code UK
    }

    ATTENDANCE {
        uuid id PK
        uuid employee_id FK
        date date
        time clock_in
        time clock_out
        string status
    }

    PERFORMANCE {
        uuid id PK
        uuid employee_id FK
        string period
        decimal score
        string rating
    }

    AUDIT_LOGS {
        uuid id PK
        uuid user_id FK
        string action
        string entity
        json payload
        datetime timestamp
    }
```

---

## 7. Authentication & Security Flow

```mermaid
sequenceDiagram
    autonumber
    actor User as Corporate Employee
    participant UI as Login Page (React)
    participant AuthP as AuthPresenter
    participant AuthS as AuthService
    participant UserRepo as UserRepository
    participant DB as PostgreSQL DB

    User->>UI: Input corporate email (@stackly.com)
    UI->>AuthP: Validate domain format
    AuthP->>UI: Enable "Send Verification Code"
    User->>UI: Click "Send Verification Code"
    UI->>AuthS: Trigger OTP dispatch (60s countdown)
    AuthS-->>User: Dispatch 6-digit OTP code
    User->>UI: Input 6-digit OTP & credentials
    UI->>AuthP: Submit credentials
    AuthP->>AuthS: Verify OTP & Password Hash
    AuthS->>UserRepo: Fetch User + Role + Permissions
    UserRepo->>DB: Query User & RolePermissions
    DB-->>UserRepo: Return Entity Records
    AuthS->>AuthS: Generate JWT Access & Refresh Token
    AuthS-->>AuthP: Return Auth DTO + Token
    AuthP->>UI: Store Token in Auth State & Redirect to Role Dashboard
```

---

## 8. Authorization Model: RBAC, DBAC & PBAC Matrix

### Role-Based Access Control (RBAC)
- **ADMIN**: Complete system governance, security policies, user management, audit logs.
- **HR MANAGER**: Organization workforce lifecycle, attendance, recruitment, performance, payroll reports.
- **DEPARTMENT MANAGER**: Department-scoped workforce metrics, leave approvals, department performance.
- **TEAM LEAD**: Sprint lead, team attendance, task allocation, team performance.
- **EMPLOYEE**: Self-service portal, my attendance, my leave, my performance reviews, my documents.

### Department-Based Access Control (DBAC)
Department Managers & HR Partners are strictly isolated to resources matching their assigned `department_id` scope (e.g., Engineering Manager cannot view Sales compensation records).

### Permission Matrix (PBAC)

| Permission Code | Admin | HR Manager | Dept Manager | Team Lead | Employee |
| :--- | :---: | :---: | :---: | :---: | :---: |
| `USER_MANAGE` | ✅ | ❌ | ❌ | ❌ | ❌ |
| `ROLE_MANAGE` | ✅ | ❌ | ❌ | ❌ | ❌ |
| `SYSTEM_CONFIG` | ✅ | ❌ | ❌ | ❌ | ❌ |
| `AUDIT_LOG_VIEW` | ✅ | ❌ | ❌ | ❌ | ❌ |
| `EMPLOYEE_VIEW_ALL` | ✅ | ✅ | ❌ | ❌ | ❌ |
| `EMPLOYEE_VIEW_DEPT` | ✅ | ✅ | ✅ | ❌ | ❌ |
| `ATTENDANCE_VIEW_ALL` | ✅ | ✅ | ❌ | ❌ | ❌ |
| `ATTENDANCE_APPROVE` | ✅ | ✅ | ✅ | ✅ | ❌ |
| `PERFORMANCE_MANAGE` | ✅ | ✅ | ✅ | ❌ | ❌ |
| `REPORT_EXPORT` | ✅ | ✅ | ✅ | ❌ | ❌ |
| `PROFILE_VIEW_SELF` | ✅ | ✅ | ✅ | ✅ | ✅ |

---

## 9. Sidebar Architecture Specifications
- **Fixed Width**: `280px` expanded, `80px` collapsed mode.
- **Header Section**: Mint-teal & deep-navy ribbon SVG logo, **Stackly Workforce Analytics** branding, subtitle **Workforce Intelligence Platform**, collapse/expand toggle button.
- **Menu Hierarchy**:
  1. *Dashboard* (Overview, Workforce Insights)
  2. *Workforce Management* (Employees, Departments, Locations, Org Chart)
  3. *Attendance Management* (Attendance Dashboard, Check In/Out, My Attendance, Team Attendance, Reports, Shifts)
  4. *Performance Management* (Performance Dashboard, Reviews, Goals/KPIs, Reports)
  5. *Reports & Analytics* (Workforce Reports, Attendance Reports, Performance Reports, Export Center)
  6. *Administration* (User Management, Roles & Permissions, System Settings, Audit Logs)
- **User Profile Footer Card**: Employee photo, Name (`Maheswari Pinneti`), Title (`Frontend Developer`), Department (`Engineering`), with actions for *Profile*, *Account Settings*, and *Logout Modal*.

---

## 10. Header Architecture Specifications
- **Fixed Top Bar (`h-[72px] sticky top-0 z-40`)**: Glassmorphism backdrop blur, zero reload, persistent layout.
- **Left Section**: Sidebar hamburger toggle, dynamic drill-down breadcrumb navigation (`Workforce / Employees / Employee Profile`), dynamic page context actions (`+ Add Employee`, `Import`, `Export`, `Check In / Out`, `Save Changes`).
- **Center Section**: Fixed global search box (`Search employees, reports, departments...`) with category filters (`All`, `Employees`, `Departments`, `Reports`, `Security`).
- **Right Section**: Notifications bell (3 unread badge), team messages, theme toggle (`Light` ↔ `Dark Navy`), Help Desk support icon, user avatar profile menu.

---

## 11. Deployment & Infrastructure Architecture

```mermaid
flowchart TD
    subgraph CDN["Edge CDN Layer (Cloudflare / AWS CloudFront)"]
        ASSETS["Static Assets & React Bundle"]
    end

    subgraph GATEWAY["API Gateway Layer (Kong / NGINX)"]
        SSL["SSL Termination & Rate Limiting"]
        AUTH_VAL["JWT Token Validator"]
    end

    subgraph K8S["Kubernetes Cluster (EKS / GKE)"]
        POD1["Auth Microservice Pods"]
        POD2["Workforce Analytics Pods"]
        POD3["Reporting Service Pods"]
    end

    subgraph DATA["Managed Persistence Layer"]
        DB_PRIMARY[("PostgreSQL Multi-AZ Primary")]
        DB_REPLICA[("Read Replicas")]
        REDIS_CLUSTER[("Redis Enterprise Cluster")]
    end

    CDN <--> GATEWAY
    GATEWAY <--> K8S
    K8S <--> DATA
```
