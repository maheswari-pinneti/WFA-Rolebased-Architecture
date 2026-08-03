# Workforce Analytics Dashboard - MVP Enterprise Architecture

This document defines the 5-layer Model-View-Presenter (MVP) enterprise architecture, authentication flow, RBAC + DBAC security architecture, request sequence flow, database ER model, and frontend directory structure for the **Workforce Analytics Dashboard**.

---

## 1. MVP Enterprise Architecture Diagram

```mermaid
---
title: "Workforce Analytics Dashboard - MVP Enterprise Architecture"
---
flowchart TD
    subgraph USERS["Enterprise Users"]
        U1["Admin (System Admin)"]
        U2["HR Manager (HR Ops)"]
        U3["Dept Manager (Engineering / Finance / Sales)"]
        U4["Team Lead (Sprint Lead)"]
        U5["Employee (Self-Service)"]
    end

    subgraph VIEW["PRESENTATION LAYER (VIEW - React 18 + TS + Vite)"]
        V_LOGIN["Login Page"]
        V_DASH["Dashboard & KPI Cards"]
        V_EMP["Employee Dashboard"]
        V_ATT["Attendance Dashboard"]
        V_PERF["Performance Dashboard"]
        V_REP["Reports Dashboard"]
        V_USER_MGMT["User Management"]
        V_ROLE_MGMT["Role Management"]
        V_PERM_MGMT["Permission Management"]
        V_SETT["System Settings"]
        V_COMP["Recharts, Tables & Filter Bars"]
    end

    subgraph PRESENTER["PRESENTER LAYER (State & Event Validation)"]
        P_AUTH["Authentication Presenter"]
        P_DASH["Dashboard Presenter"]
        P_EMP["Employee Presenter"]
        P_ATT["Attendance Presenter"]
        P_PERF["Performance Presenter"]
        P_REP["Report Presenter"]
        P_PERM["Permission Presenter"]
    end

    subgraph BUSINESS["BUSINESS LAYER (Business Services & Rules)"]
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

    subgraph PERSISTENCE["PERSISTENCE LAYER (Repositories & Data Access)"]
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

    subgraph DB["DATABASE LAYER (Relational Schema)"]
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

## 2. Authentication Flow

```mermaid
sequenceDiagram
    autonumber
    title: Workforce Analytics Dashboard - Authentication & Security Flow
    actor User
    participant View as Login Page (View)
    participant Pres as Auth Presenter
    participant AuthSvc as Auth Service
    participant MFA as MFA Gateway
    participant JWT as JWT Issuer
    participant DB as PostgreSQL Database

    User->>View: 1. Enter Email (e.g. employee@company.com) & Password
    View->>Pres: 2. Submit Credentials
    
    alt Invalid Email Domain (e.g. @gmail.com)
        Pres-->>View: Reject (Domain Access Denied)
        View-->>User: Display Error: Only @company.com permitted
    else Valid Corporate Domain (@company.com)
        Pres->>AuthSvc: 3. Validate Password Hash
        AuthSvc->>DB: Query User & Password Hash
        DB-->>AuthSvc: User Record Data
        
        alt Password Mismatch
            AuthSvc-->>Pres: Authentication Failed
            Pres-->>View: Display Error: Invalid Credentials
        else Password Verified
            AuthSvc->>MFA: 4. Trigger MFA Challenge (OTP / Authenticator)
            MFA-->>User: Send 6-Digit Code
            User->>View: 5. Enter MFA Code (123456)
            View->>Pres: Submit MFA Code
            
            alt MFA Code Invalid
                Pres-->>View: Display Error: MFA Verification Failed
            else MFA Code Valid
                Pres->>JWT: 6. Issue JWT Access Token & Refresh Token
                JWT-->>Pres: Return JWT Token & Claims (Role, Dept, Perms)
                Pres->>View: Store JWT Session & Redirect
                View-->>User: 7. Display Authorized Dashboard
            end
        end
    end
```

---

## 3. RBAC + Department Access (DBAC) Architecture

```mermaid
---
title: "Workforce Analytics Dashboard - RBAC + Department Access (DBAC) Architecture"
---
flowchart TD
    subgraph ROLES["RBAC Hierarchy (5 Level Tiers)"]
        LEVEL1["LEVEL 1: ADMIN<br/>(Full Organization Access)"]
        LEVEL2["LEVEL 2: HR MANAGER<br/>(Workforce & Recruitment Scope)"]
        LEVEL3["LEVEL 3: DEPARTMENT MANAGER<br/>(Single Department DBAC Boundary)"]
        LEVEL4["LEVEL 4: TEAM LEAD<br/>(Assigned Team Members Scope)"]
        LEVEL5["LEVEL 5: EMPLOYEE<br/>(Self Data Only Scope)"]

        LEVEL1 --> LEVEL2
        LEVEL2 --> LEVEL3
        LEVEL3 --> LEVEL4
        LEVEL4 --> LEVEL5
    end

    subgraph DBAC["Department Access Control (DBAC Boundary)"]
        D_HR["Human Resources"]
        D_ENG["Engineering<br/>(Frontend, Backend, QA, DevOps)"]
        D_FIN["Finance<br/>(Payroll & Salary)"]
        D_SALES["Sales<br/>(Quota & Pipelines)"]
        D_MKT["Marketing<br/>(Campaigns)"]
        D_OPS["Operations<br/>(Logistics)"]
        D_SUPP["Customer Support<br/>(Ticket SLAs)"]
    end

    subgraph MATRIX["Permission Level Matrix"]
        P_SYS["System Config & Audit Logs"]
        P_EMP["Employee Directory & HR"]
        P_DEPT["Department Analytics & Approvals"]
        P_TEAM["Sprint Tasks & Attendance"]
        P_SELF["Personal Dashboard & Payslips"]
    end

    LEVEL1 -.->|Full Access| D_HR & D_ENG & D_FIN & D_SALES & D_MKT & D_OPS & D_SUPP
    LEVEL2 -.->|All Employees| D_HR & D_ENG & D_FIN & D_SALES & D_MKT & D_OPS & D_SUPP
    LEVEL3 -.->|Scoped DBAC| D_ENG
    LEVEL3 -.->|Scoped DBAC| D_FIN
    LEVEL3 -.->|Scoped DBAC| D_SALES
    LEVEL4 -.->|Direct Reports| D_ENG
    LEVEL5 -.->|Self Record| D_ENG

    LEVEL1 --> P_SYS
    LEVEL2 --> P_EMP
    LEVEL3 --> P_DEPT
    LEVEL4 --> P_TEAM
    LEVEL5 --> P_SELF
```

---

## 4. Complete Request Flow

```mermaid
sequenceDiagram
    autonumber
    title: Workforce Analytics Dashboard - Complete MVP Request Flow
    actor User
    participant View as React View (UI)
    participant Pres as Presenter Layer
    participant Svc as Business Service
    participant Repo as Repository
    participant DB as Database Layer

    User->>View: 1. User Action (e.g. Click Approve Leave Request)
    View->>Pres: 2. Dispatch UI Event (handleApproveLeave)
    Pres->>Pres: 3. Validate Inputs & Check Permission Matrix
    Pres->>Svc: 4. Execute Business Action (approveLeaveRequest)
    Svc->>Svc: 5. Apply RBAC & DBAC Scoping (Validate Dept & Role)
    
    alt Authorization Fails
        Svc-->>Pres: 403 Forbidden Error
        Pres-->>View: Display Authorization Denied Alert
        View-->>User: Show Security Warning
    else Authorization Passed
        Svc->>Repo: 6. Request Database Update (updateLeaveStatus)
        Repo->>DB: 7. Execute SQL Query / Transaction
        DB-->>Repo: 8. SQL Query Result & Row Impact
        Repo-->>Svc: 9. Repository Entity Response
        Svc->>Svc: 10. Process KPI & Audit Log Event
        Svc-->>Pres: 11. Return Formatted Business DTO
        Pres->>Pres: 12. Transform DTO into ViewModel State
        Pres-->>View: 13. Re-render View with Updated State
        View-->>User: 14. Render Success Notification & Updated UI
    end
```

---

## 5. Database ER Diagram

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

## 6. Frontend Folder Architecture

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

## 7. Security Architecture

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
