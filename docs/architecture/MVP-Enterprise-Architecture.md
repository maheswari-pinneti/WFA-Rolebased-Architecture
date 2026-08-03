# WORKFORCE ANALYTICS DASHBOARD
## Enterprise System Architecture & Technical Specifications (MVP Design Pattern)

The **Workforce Analytics Dashboard** is an enterprise-grade workforce intelligence platform built on a 5-Layer **Model-View-Presenter (MVP)** architecture pattern. This document provides complete architectural specifications, layer responsibilities, sequence flows, security boundaries, and database entity relationships.

---

## 1. MVP Enterprise Architecture Diagram

```mermaid
---
title: "Workforce Analytics Dashboard - MVP Enterprise Architecture"
---
flowchart TD
    subgraph USERS["Enterprise Users (5 Role Tiers)"]
        U1["Admin (System Administrator)"]
        U2["HR Manager (HR Operations)"]
        U3["Dept Manager (Department Head)"]
        U4["Team Lead (Sprint Lead)"]
        U5["Employee (Self-Service)"]
    end

    subgraph VIEW["1. PRESENTATION LAYER (VIEW)"]
        V_LOGIN["Login Page"]
        V_DASH["Admin Dashboard"]
        V_EMP_DASH["Employee Dashboard"]
        V_ATT_DASH["Attendance Dashboard"]
        V_PERF_DASH["Performance Dashboard"]
        V_REP_DASH["Reports Dashboard"]
        V_USER_MGMT["User Management"]
        V_ROLE_MGMT["Role Management"]
        V_PERM_MGMT["Permission Management"]
        V_SETTINGS["System Settings"]
        V_COMPONENTS["UI Components (Recharts, Tables, Filters)"]
    end

    subgraph PRESENTER["2. PRESENTER LAYER (UI Logic & ViewModel)"]
        P_AUTH["Authentication Presenter"]
        P_DASH["Dashboard Presenter"]
        P_EMP["Employee Presenter"]
        P_ATT["Attendance Presenter"]
        P_PERF["Performance Presenter"]
        P_REP["Report Presenter"]
        P_PERM["Permission Presenter"]
    end

    subgraph BUSINESS["3. BUSINESS LAYER (Core Business Services)"]
        B_AUTH["Authentication Service"]
        B_USER["User Management Service"]
        B_ROLE["Role Service"]
        B_PERM["Permission Service"]
        B_EMP["Employee Service"]
        B_DEPT["Department Service"]
        B_ATT["Attendance Service"]
        B_PERF["Performance Service"]
        B_PAY["Payroll Service"]
        B_REP["Report Service"]
        B_NOTIF["Notification Service"]
    end

    subgraph PERSISTENCE["4. PERSISTENCE LAYER (Repositories)"]
        R_USER["User Repository"]
        R_EMP["Employee Repository"]
        R_ROLE["Role Repository"]
        R_PERM["Permission Repository"]
        R_DEPT["Department Repository"]
        R_TEAM["Team Repository"]
        R_ATT["Attendance Repository"]
        R_PERF["Performance Repository"]
        R_PAY["Payroll Repository"]
        R_REP["Report Repository"]
    end

    subgraph DB["5. DATABASE LAYER (Relational Storage)"]
        DB_USERS[("USERS")]
        DB_ROLES[("ROLES")]
        DB_PERMS[("PERMISSIONS")]
        DB_ROLE_PERMS[("ROLE_PERMISSIONS")]
        DB_DEPTS[("DEPARTMENTS")]
        DB_TEAMS[("TEAMS")]
        DB_EMPS[("EMPLOYEES")]
        DB_ATT[("ATTENDANCE")]
        DB_PERF[("PERFORMANCE")]
        DB_PAY[("PAYROLL")]
        DB_REPS[("REPORTS")]
        DB_AUDIT[("AUDIT_LOGS")]
    end

    USERS --> VIEW
    VIEW --> PRESENTER
    PRESENTER --> BUSINESS
    BUSINESS --> PERSISTENCE
    PERSISTENCE --> DB
```

---

## 2. Detailed Layer Specifications

### 1. Presentation Layer (View)
- **Components**: `Login Page`, `Dashboard`, `Employee Dashboard`, `Attendance Dashboard`, `Performance Dashboard`, `Reports Dashboard`, `User Management`, `Role Management`, `Permission Management`, `Settings`, `Charts`, `Tables`, `Filters`.
- **Responsibilities**:
  - Render dynamic user interfaces & glassmorphism components.
  - Receive user mouse/keyboard input events.
  - Render real-time SVG charts (Recharts) and data tables.
  - Display role-based views dynamically based on user session state.
- **Technologies**: React 18/19, TypeScript, Vite, React Router, Redux Toolkit, React Query, Material UI, Tailwind CSS, Recharts.

### 2. Presenter Layer
- **Components**: `Authentication Presenter`, `Dashboard Presenter`, `Employee Presenter`, `Attendance Presenter`, `Performance Presenter`, `Report Presenter`, `Permission Presenter`.
- **Responsibilities**:
  - Connect View components with Business Layer services.
  - Intercept UI events and validate user action prerequisites.
  - Transform raw DTO responses into UI ViewModels.
  - Validate form fields and user permissions before dispatching.

### 3. Business Layer
- **Services**: `Authentication Service`, `User Management Service`, `Role Service`, `Permission Service`, `Employee Service`, `Department Service`, `Attendance Service`, `Performance Service`, `Payroll Service`, `Report Service`, `Notification Service`.
- **Responsibilities**:
  - Execute business rules & KPI calculation logic.
  - Enforce RBAC validation & DBAC department access boundaries.
  - Handle approval workflows & event notifications.
- **Business Rule Example**:
  ```text
  IF user.role == "ENGINEERING_MANAGER" AND department == "ENGINEERING":
      ALLOW: Engineering analytics & team metrics
      DENY: Finance payroll & salary records
  ```

### 4. Persistence Layer
- **Repositories**: `User Repository`, `Employee Repository`, `Role Repository`, `Permission Repository`, `Department Repository`, `Team Repository`, `Attendance Repository`, `Performance Repository`, `Payroll Repository`, `Report Repository`.
- **Responsibilities**:
  - Abstract database communication and query construction.
  - Perform CRUD operations and data mapping.
  - Manage database transactions and connection pools.

### 5. Database Layer
- **Tables**: `USERS`, `ROLES`, `PERMISSIONS`, `ROLE_PERMISSIONS`, `DEPARTMENTS`, `TEAMS`, `EMPLOYEES`, `ATTENDANCE`, `PERFORMANCE`, `PAYROLL`, `REPORTS`, `AUDIT_LOGS`.
- **Relationships**:
  - User belongs to Role (`USERS.role_id -> ROLES.role_id`)
  - User belongs to Department (`USERS.department_id -> DEPARTMENTS.department_id`)
  - Department contains Teams (`DEPARTMENTS -> TEAMS`)
  - Team contains Employees (`TEAMS -> EMPLOYEES`)
  - Role contains Permissions (`ROLES -> ROLE_PERMISSIONS -> PERMISSIONS`)
  - Employee has Attendance (`EMPLOYEES -> ATTENDANCE`)
  - Employee has Performance (`EMPLOYEES -> PERFORMANCE`)

---

## 3. Authentication & Security Flow

```mermaid
sequenceDiagram
    autonumber
    title: Workforce Analytics Dashboard - Authentication Flow
    actor User
    participant View as Login Page (View)
    participant Pres as Auth Presenter
    participant AuthSvc as Auth Service
    participant MFA as MFA Gateway
    participant JWT as JWT Issuer
    participant DB as PostgreSQL Database

    User->>View: 1. Enter Corporate Email (@company.com) & Password
    View->>Pres: 2. Submit Credentials
    
    alt Invalid Email Domain (e.g. user@gmail.com)
        Pres-->>View: Reject Authentication (Invalid Domain)
        View-->>User: Error: Only official @company.com emails permitted
    else Valid Corporate Domain (@company.com)
        Pres->>AuthSvc: 3. Verify Password Hash
        AuthSvc->>DB: Query User & Credentials
        DB-->>AuthSvc: User Record Data
        
        alt Invalid Password
            AuthSvc-->>Pres: Authentication Failed
            Pres-->>View: Error: Invalid Credentials
        else Password Validated
            AuthSvc->>MFA: 4. Trigger MFA Challenge (OTP Code)
            MFA-->>User: Send 6-Digit Verification Code
            User->>View: 5. Enter MFA Code (123456)
            View->>Pres: Submit MFA Code
            
            alt MFA Failed
                Pres-->>View: Error: Invalid MFA OTP Code
            else MFA Succeeded
                Pres->>JWT: 6. Generate JWT Access Token & Refresh Token
                JWT-->>Pres: Return Token with Claims (Role, Dept, Permissions)
                Pres->>View: Store JWT Session & Set Auth State
                View-->>User: 7. Redirect to Authorized Dashboard
            end
        end
    end
```

---

## 4. RBAC + Department Access (DBAC) Architecture

```mermaid
---
title: "Workforce Analytics Dashboard - RBAC + Department Access Architecture"
---
flowchart TD
    subgraph ROLES["RBAC Role Hierarchy"]
        R1["ADMIN (Level 1 - Full Governance)"]
        R2["HR MANAGER (Level 2 - Org HR Ops)"]
        R3["DEPARTMENT MANAGER (Level 3 - Dept DBAC Boundary)"]
        R4["TEAM LEAD (Level 4 - Sprint Team Scope)"]
        R5["EMPLOYEE (Level 5 - Self-Service Only)"]

        R1 --> R2
        R2 --> R3
        R3 --> R4
        R4 --> R5
    end

    subgraph DEPARTMENTS["DBAC Department Boundaries"]
        D_HR["Human Resources"]
        D_ENG["Engineering"]
        D_FIN["Finance"]
        D_SALES["Sales"]
        D_MKT["Marketing"]
        D_OPS["Operations"]
        D_SUPP["Customer Support"]
    end

    subgraph SCOPE["Access Permission Scopes"]
        P1["Full Platform & System Settings"]
        P2["Workforce Directory & Recruitment"]
        P3["Department Analytics & Approvals"]
        P4["Team Sprint & Attendance Tracking"]
        P5["Personal Profile & Payslip View"]
    end

    R1 -.->|Unrestricted Access| D_HR & D_ENG & D_FIN & D_SALES & D_MKT & D_OPS & D_SUPP
    R2 -.->|All Departments| D_HR & D_ENG & D_FIN & D_SALES & D_MKT & D_OPS & D_SUPP
    R3 -.->|Scoped DBAC Boundary| D_ENG
    R3 -.->|Scoped DBAC Boundary| D_FIN
    R4 -.->|Assigned Team Only| D_ENG
    R5 -.->|Self Record Only| D_ENG

    R1 --> P1
    R2 --> P2
    R3 --> P3
    R4 --> P4
    R5 --> P5
```

---

## 5. Complete Request Flow

```mermaid
sequenceDiagram
    autonumber
    title: Workforce Analytics Dashboard - Complete Request Flow
    actor User
    participant View as React View Component
    participant Pres as Presenter Layer
    participant Svc as Business Service
    participant Repo as Repository Layer
    participant DB as Database Engine

    User->>View: 1. User Action (e.g. Request Leave / Submit Evaluation)
    View->>Pres: 2. Dispatch Action Event
    Pres->>Pres: 3. Validate View State & Inputs
    Pres->>Svc: 4. Invoke Business Service Operation
    Svc->>Svc: 5. Enforce RBAC & DBAC Authorization Rules
    
    alt Unauthorized Access
        Svc-->>Pres: 403 Forbidden (DBAC Boundary Breach)
        Pres-->>View: Show Permission Denied Alert
        View-->>User: Display Security Warning
    else Authorization Granted
        Svc->>Repo: 6. Execute Repository Query Method
        Repo->>DB: 7. Run SQL Prepared Statement / Transaction
        DB-->>Repo: 8. Return Result Set / Affected Rows
        Repo-->>Svc: 9. Return Data Entity
        Svc->>Svc: 10. Compute Business Logic & Audit Event
        Svc-->>Pres: 11. Return Business DTO Response
        Pres->>Pres: 12. Format Data into View Model State
        Pres-->>View: 13. Trigger Re-render with Updated Data
        View-->>User: 14. Update UI Display & Render Confirmation
    end
```

---

## 6. Database ER Diagram

```mermaid
erDiagram
    WORKFORCE_ANALYTICS_DASHBOARD_ERD {
        string title "Workforce Analytics Dashboard - Database ER Diagram"
    }

    USERS {
        uuid user_id PK
        string employee_code FK
        string official_email
        string password_hash
        uuid role_id FK
        uuid department_id FK
        uuid team_id FK
        string status
        boolean mfa_enabled
        timestamp created_at
    }

    ROLES {
        uuid role_id PK
        string role_name
        int level
    }

    PERMISSIONS {
        uuid permission_id PK
        string permission_name
        string module
    }

    ROLE_PERMISSIONS {
        uuid role_id PK, FK
        uuid permission_id PK, FK
    }

    DEPARTMENTS {
        uuid department_id PK
        string department_name
        string code
    }

    TEAMS {
        uuid team_id PK
        uuid department_id FK
        string team_name
        uuid team_lead_id FK
    }

    EMPLOYEES {
        uuid employee_id PK
        string name
        uuid department_id FK
        uuid team_id FK
        uuid manager_id FK
        string designation
        decimal performance_score
    }

    ATTENDANCE {
        uuid attendance_id PK
        uuid employee_id FK
        date record_date
        time clock_in
        time clock_out
        string status
    }

    PERFORMANCE {
        uuid performance_id PK
        uuid employee_id FK
        string quarter
        decimal kpi_score
        decimal target_score
    }

    PAYROLL {
        uuid payroll_id PK
        uuid employee_id FK
        string month_year
        decimal base_salary
        decimal net_pay
        string status
    }

    REPORTS {
        uuid report_id PK
        string report_name
        string category
        uuid created_by FK
        timestamp generated_at
    }

    AUDIT_LOGS {
        uuid log_id PK
        uuid user_id FK
        string action
        string resource
        string severity
        timestamp timestamp
    }

    USERS ||--o{ EMPLOYEES : "has_profile"
    ROLES ||--o{ USERS : "assigned_to"
    ROLES ||--o{ ROLE_PERMISSIONS : "contains"
    PERMISSIONS ||--o{ ROLE_PERMISSIONS : "mapped_in"
    DEPARTMENTS ||--o{ TEAMS : "parent_of"
    DEPARTMENTS ||--o{ EMPLOYEES : "belongs_to"
    TEAMS ||--o{ EMPLOYEES : "assigned_to"
    EMPLOYEES ||--o{ ATTENDANCE : "logs"
    EMPLOYEES ||--o{ PERFORMANCE : "evaluated_in"
    EMPLOYEES ||--o{ PAYROLL : "receives"
    USERS ||--o{ REPORTS : "generates"
    USERS ||--o{ AUDIT_LOGS : "triggers"
```

---

## 7. Frontend Folder Architecture

```mermaid
---
title: "Workforce Analytics Dashboard - Frontend Folder Architecture"
---
graph TD
    SRC["src"]

    SRC --> PRESENTATION["presentation"]
    PRESENTATION --> P_COMP["components (Recharts, Tables, FilterBars)"]
    PRESENTATION --> P_PAGES["pages (Dashboard, Employees, Attendance, Performance, Payroll, Reports, Settings)"]
    PRESENTATION --> P_LAYOUTS["layouts (Header, Sidebar, DashboardLayout)"]

    SRC --> PRESENTERS["presenters"]
    PRESENTERS --> PR_AUTH["authPresenter.ts"]
    PRESENTERS --> PR_EMP["employeePresenter.ts"]
    PRESENTERS --> PR_ATT["attendancePresenter.ts"]
    PRESENTERS --> PR_PERF["performancePresenter.ts"]
    PRESENTERS --> PR_REP["reportPresenter.ts"]

    SRC --> BUSINESS["business"]
    BUSINESS --> B_RULES["rbacRules.ts"]
    BUSINESS --> B_DBAC["dbacRules.ts"]
    BUSINESS --> B_KPI["kpiCalculator.ts"]

    SRC --> SERVICES["services"]
    SERVICES --> S_API["apiService.ts"]
    SERVICES --> S_AUTH["authService.ts"]
    SERVICES --> S_EMP["employeeService.ts"]

    SRC --> REPOS["repositories"]
    REPOS --> R_USER["userRepository.ts"]
    REPOS --> R_EMP["employeeRepository.ts"]

    SRC --> REDUX["redux"]
    REDUX --> RD_AUTH["authSlice.ts"]
    REDUX --> RD_USER["userSlice.ts"]
    REDUX --> RD_PERM["permissionSlice.ts"]

    SRC --> ROUTES["routes"]
    ROUTES --> RT_APP["AppRoutes.tsx"]

    SRC --> UTILS["utils"]
    UTILS --> U_HELPERS["helpers.ts"]
```

---

## 8. Security Architecture Flow

```mermaid
---
title: "Workforce Analytics Dashboard - Security Architecture Flow"
---
flowchart TD
    START(["User Login Action"]) --> EMAIL["Official Company Email Verification<br/>(@company.com Required)"]
    EMAIL --> PWD["Password Authentication & Hash Check"]
    PWD --> MFA["Multi-Factor Authentication (MFA OTP)"]
    MFA --> JWT["Generate JWT Access Token & Refresh Token"]
    JWT --> ROLE["Role Validation (RBAC Levels 1 - 5)"]
    ROLE --> DEPT["Department Validation (DBAC Scoping)"]
    DEPT --> PERM["Permission Validation (30+ Granular Rules)"]
    PERM --> ROUTE["Protected Route Access (<RoleGuard>)"]
    ROUTE --> API["API Authorization (Axios Bearer Token)"]
    API --> DB_FILTER["Database Query Filtering (SQL Where Clause Scope)"]
    DB_FILTER --> END_OK(["Authorized JSON Data Response"])
```
