# Stackly Workforce Analytics Dashboard
## Production Enterprise Architecture & System Specifications

**System Name:** Stackly Workforce Analytics Dashboard  
**Architect:** Senior Solution Architect & Principal UI/UX Lead  
**Design Patterns:** MVP (Model-View-Presenter), 4-Layer Architecture (Presentation, Business Logic, Persistence, Database)  
**Security Framework:** RBAC (Role-Based Access Control) + DBAC (Department-Based Access Control)  

---

## 1. System Architecture Diagram (4-Layer & MVP Architecture)

```mermaid
flowchart TD
    subgraph PRESENTATION["1. Presentation Layer (React 19 + TypeScript + Tailwind CSS)"]
        UI_VIEWS["UI Views & Pages (AdminDashboard, EmployeeTable, LoginPage, etc.)"]
        HEADER["EnterpriseHeader (Fixed 72px Top Bar)"]
        SIDEBAR["Sidebar Navigation (280px / 80px Glassmorphism Drawer)"]
        PRESENTERS["MVP Presenters (DashboardPresenter, EmployeePresenter)"]
    end

    subgraph BUSINESS["2. Business Logic Layer (Redux Toolkit + TanStack Query)"]
        AUTH_REDUCER["Auth Slice & JWT Manager"]
        HR_REDUCER["HR & Employee Store"]
        PERM_ENGINE["RBAC & PBAC Permission Engine (accessControl.ts)"]
        WORKFLOW_RULES["Approval & Department Rules (DBAC)"]
    end

    subgraph PERSISTENCE["3. Persistence Layer (Axios Client + API Endpoints)"]
        HTTP_CLIENT["Axios Interceptor & Token Refresher"]
        AUTH_API["auth.api.ts (MFA, Login, Session)"]
        EMP_API["employee.api.ts (20,000 Headcount Service)"]
        CACHE_LAYER["Browser LocalStorage & IndexedDB Cache"]
    end

    subgraph DATABASE["4. Database Layer (PostgreSQL / MySQL + Redis Cache)"]
        PG_DB[("PostgreSQL RDBMS (Employees, Roles, Attendance, Audit)")]
        REDIS[("Redis In-Memory Session Cache")]
    end

    UI_VIEWS --> PRESENTERS
    HEADER --> UI_VIEWS
    SIDEBAR --> UI_VIEWS
    PRESENTERS --> AUTH_REDUCER
    PRESENTERS --> HR_REDUCER
    AUTH_REDUCER --> PERM_ENGINE
    HR_REDUCER --> WORKFLOW_RULES
    PERM_ENGINE --> HTTP_CLIENT
    HTTP_CLIENT --> AUTH_API
    HTTP_CLIENT --> EMP_API
    HTTP_CLIENT --> CACHE_LAYER
    AUTH_API --> REDIS
    EMP_API --> PG_DB
```

---

## 2. RBAC Permission & Authorization Flow Diagram

```mermaid
flowchart TD
    START["User Requests Protected Route / Action"] --> AUTH_CHECK{"Authenticated Token Active?"}
    
    AUTH_CHECK -->|No| LOGIN_REDIRECT["Redirect to /login (@thestackly.com)"]
    AUTH_CHECK -->|Yes| ROLE_FETCH["Extract User Role & Clearance Level"]

    ROLE_FETCH --> EVAL_ROLE{"Evaluate Role Level (1 - 5)"}
    
    EVAL_ROLE -->|Level 1: ADMIN| ADMIN_GRANT["Full Access: Audit Logs, Configuration, User Mgmt"]
    EVAL_ROLE -->|Level 2: HR_MANAGER| HR_GRANT["Access: Employee Lifecycle, Records, HR Reports"]
    EVAL_ROLE -->|Level 3: TEAM_MANAGER| MGR_GRANT["Access: Department Analytics, Team Approvals"]
    EVAL_ROLE -->|Level 4: TEAM_LEAD| LEAD_GRANT["Access: Team Monitoring & Task Tracking"]
    EVAL_ROLE -->|Level 5: EMPLOYEE| EMP_GRANT["Access: Personal Workspace & My Attendance"]

    ADMIN_GRANT --> PERM_CHECK{"Required Permission Matrix Allowed?"}
    HR_GRANT --> PERM_CHECK
    MGR_GRANT --> PERM_CHECK
    LEAD_GRANT --> PERM_CHECK
    EMP_GRANT --> PERM_CHECK

    PERM_CHECK -->|Granted| RENDER["Render View Component"]
    PERM_CHECK -->|Denied| FORBIDDEN["Redirect to 403 Access Denied Page"]
```

---

## 3. Database ER Diagram (Relational Data Model)

```mermaid
erDiagram
    USERS ||--o{ ROLES : "assigned"
    ROLES ||--o{ PERMISSIONS : "contains"
    EMPLOYEES ||--|| USERS : "authenticates_as"
    EMPLOYEES ||--o{ ATTENDANCE : "logs"
    EMPLOYEES ||--o{ PERFORMANCE : "evaluates"
    EMPLOYEES ||--o{ SALARY : "receives"
    DEPARTMENTS ||--o{ EMPLOYEES : "belongs_to"
    LOCATIONS ||--o{ EMPLOYEES : "stationed_at"
    EMPLOYEES ||--o{ NOTIFICATIONS : "receives"
    EMPLOYEES ||--o{ AUDIT_LOGS : "triggers"

    USERS {
        uuid id PK
        string email
        string password_hash
        string role_id FK
        boolean mfa_enabled
        datetime last_login
    }

    EMPLOYEES {
        uuid employee_id PK
        string employee_code
        string full_name
        uuid department_id FK
        uuid location_id FK
        string designation
        decimal salary_amount
        string status
    }

    ATTENDANCE {
        uuid attendance_id PK
        uuid employee_id FK
        date clock_date
        time clock_in
        time clock_out
        string status
    }

    PERFORMANCE {
        uuid review_id PK
        uuid employee_id FK
        decimal kpi_score
        string reviewer_notes
        string period
    }

    DEPARTMENTS {
        uuid department_id PK
        string name
        uuid manager_id FK
    }

    AUDIT_LOGS {
        uuid log_id PK
        uuid user_id FK
        string action
        string ip_address
        timestamp created_at
    }
```

---

## 4. User Authentication Flow Diagram (Multi-Factor & Domain Verification)

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant UI as Login Page UI
    participant Service as AuthService
    participant API as Backend Auth API
    participant DB as PostgreSQL & Redis

    User->>UI: Enter Email (e.g. employee@thestackly.com)
    UI->>UI: Validate @thestackly.com Domain Format
    User->>UI: Click "Send Code" / Enter Password
    UI->>Service: Dispatch Verification OTP Request
    Service->>API: POST /api/auth/otp-generate
    API->>DB: Save One-Time Password Token (60s TTL)
    API-->>UI: Return 200 OTP Sent
    User->>UI: Enter 6-digit OTP Code & Submit
    UI->>Service: POST /api/auth/login
    Service->>API: Verify Password & OTP Code
    API->>DB: Fetch User Role & Permission Array
    DB-->>API: User Data + JWT Bearer Token
    API-->>UI: Return JWT Token & User Profile
    UI->>UI: Store Session in Redux & LocalStorage
    UI-->>User: Redirect to Role Dashboard (/dashboard)
```

---

## 5. Application Navigation Flow Diagram

```mermaid
flowchart LR
    LOGIN["Login Page (/login)"] --> AUTH_GUARD{"Is Authenticated?"}

    AUTH_GUARD -->|Yes| LAYOUT["MainLayout Container (Header + Sidebar)"]
    AUTH_GUARD -->|No| LOGIN

    LAYOUT --> DASHBOARD["1. Admin / Employee Dashboard (/dashboard)"]
    LAYOUT --> ANALYTICS["2. Analytics Suite (/analytics)"]
    LAYOUT --> EMPLOYEES["3. Employee Management (/employees)"]
    LAYOUT --> DIRECTORY["4. Employee Directory (/employee-directory)"]
    LAYOUT --> DEPTS["5. Departments (/departments)"]
    LAYOUT --> LOCATIONS["6. Location Management (/locations)"]
    LAYOUT --> AUDIT["7. Audit Logs (/audit-logs) [ADMIN]"]
    LAYOUT --> REPORTS["8. Reports (/reports)"]
    LAYOUT --> CONFIG["9. Configuration (/configuration) [ADMIN]"]
    LAYOUT --> SETTINGS["10. System Settings (/settings) [ADMIN]"]
    LAYOUT --> HELP["11. Help & Q/A (/help)"]

    LAYOUT --> PROFILE["User Profile (/profile)"]
    LAYOUT --> LOGOUT["Logout Action -> Clear Session -> Redirect /login"]
```
