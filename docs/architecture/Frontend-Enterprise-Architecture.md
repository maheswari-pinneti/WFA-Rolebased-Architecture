# STACKLY Workforce Analytics Dashboard
## Production Frontend Architecture & Security Flow Specifications

**Project Name:** STACKLY Workforce Analytics Dashboard  
**Architecture:** Enterprise Feature-Based Layered MVP Architecture  
**Technology Stack:** React 19, TypeScript, Vite, Tailwind CSS, Material UI, Redux Toolkit, React Query, Recharts, Framer Motion  

---

## 1. Complete Frontend Architecture Diagram

```mermaid
flowchart TD
    subgraph PRESENTATION["Presentation Layer"]
        LAYOUT["<AppLayout /> Shell Container"]
        HEADER["<Header /> (Enterprise Fixed 72px Bar)"]
        SIDEBAR["<Sidebar /> (280px / 80px Collapsible Drawer)"]
        DASHBOARD["<AdminDashboard /> Content Area"]
        FOOTER["<Footer /> Security Specs"]
    end

    subgraph NAVIGATION["Navigation & Routing Layer"]
        ROUTES["AppRoutes.tsx (React Router DOM)"]
        ROLE_GUARD["<RoleGuard /> Access Control"]
        PERM_GUARD["<PermissionGuard /> Action Control"]
    end

    subgraph BUSINESS["Business Logic & State Layer"]
        STORE["Redux Toolkit Store (index.ts)"]
        AUTH_SLICE["authSlice.ts (Session & Credentials)"]
        SIDEBAR_SLICE["sidebarSlice.ts (Collapsed / Mobile Open State)"]
        THEME_SLICE["themeSlice.ts (Dark / Light Theme State)"]
        TANSTACK["TanStack Query (Cache Engine)"]
    end

    subgraph SERVICES["Service & API Integration Layer"]
        API_CLIENT["apiClient (Axios Interceptor)"]
        AUTH_SVC["authService.ts (Domain Gate & MFA)"]
        EMP_SVC["employeeService.ts (20,000 Dataset Service)"]
    end

    LAYOUT --> HEADER
    LAYOUT --> SIDEBAR
    LAYOUT --> DASHBOARD
    LAYOUT --> FOOTER

    DASHBOARD --> ROUTES
    ROUTES --> ROLE_GUARD
    ROLE_GUARD --> PERM_GUARD
    PERM_GUARD --> STORE

    STORE --> AUTH_SLICE
    STORE --> SIDEBAR_SLICE
    STORE --> THEME_SLICE
    STORE --> TANSTACK

    TANSTACK --> API_CLIENT
    API_CLIENT --> AUTH_SVC
    API_CLIENT --> EMP_SVC
```

---

## 2. Sidebar Component Architecture Diagram

```mermaid
flowchart TD
    SIDEBAR_ROOT["<Sidebar /> Container"] --> LOGO["Stackly Dual-Ribbon Brand Mark"]
    SIDEBAR_ROOT --> SEARCH["<QuickSearchInput /> Navigation Filter"]
    SIDEBAR_ROOT --> NAV_MENU["<SidebarMenu /> Categorized List"]
    SIDEBAR_ROOT --> PROFILE["<UserProfile /> Card & Popup Menu"]

    NAV_MENU --> G1["Group 1: General (Dashboard, Directory, Depts, Locations)"]
    NAV_MENU --> G2["Group 2: Analytics (Workforce, Attendance, Performance, Reports)"]
    NAV_MENU --> G3["Group 3: Settings (Users, Roles, Audit Logs, Settings)"]

    G1 --> ROLE_EVAL["<RoleBasedMenu /> Permission Matrix Check"]
    G2 --> ROLE_EVAL
    G3 --> ROLE_EVAL

    ROLE_EVAL --> ITEM["<MenuItem /> NavLink Item + Badges + Tooltips"]
```

---

## 3. RBAC Flow Diagram

```mermaid
flowchart TD
    LOGIN["User Logged In Session"] --> GET_ROLE["Fetch User Role (ADMIN | HR | MANAGER | TEAM_LEAD | EMPLOYEE)"]
    GET_ROLE --> EVAL_MATRIX{"Match Role against PERMISSION_MATRIX"}

    EVAL_MATRIX -->|ADMIN| L1["Level 1: Full System Access (Users, Roles, Configuration, Audit)"]
    EVAL_MATRIX -->|HR_MANAGER| L2["Level 2: Employee Lifecycle, Records, HR Reports & Analytics"]
    EVAL_MATRIX -->|TEAM_MANAGER| L3["Level 3: Department Analytics, Team Approvals, Performance"]
    EVAL_MATRIX -->|TEAM_LEAD| L4["Level 4: Assigned Team Members, Task Tracking, Productivity"]
    EVAL_MATRIX -->|EMPLOYEE| L5["Level 5: Personal Dashboard, My Attendance, My Performance"]

    L1 --> RENDER_MENU["Render Dynamic Authorized Sidebar & Action Buttons"]
    L2 --> RENDER_MENU
    L3 --> RENDER_MENU
    L4 --> RENDER_MENU
    L5 --> RENDER_MENU
```

---

## 4. DBAC (Department Based Access Control) Permission Flow Diagram

```mermaid
flowchart TD
    REQ["User Requests Resource Data (e.g. Employee Record ID: emp-102)"] --> USER_CTX["Fetch User Context (Role, Department, Clearance)"]
    
    USER_CTX --> ROLE_CHK{"Is Role ADMIN?"}
    ROLE_CHK -->|Yes| GRANT_ALL["Grant Full Global Organization Data Scope"]
    
    ROLE_CHK -->|No| DEPT_CHK{"User Department == Resource Department?"}
    DEPT_CHK -->|Yes| ACTION_CHK{"User Action Permitted in Module Matrix?"}
    DEPT_CHK -->|No| DENY_DEPT["Deny Cross-Department Data Access (403 Forbidden)"]

    ACTION_CHK -->|Granted| SERVE_DATA["Return Filtered Department Dataset"]
    ACTION_CHK -->|Denied| DENY_ACTION["Deny Unpermissioned Action (403 Forbidden)"]
```

---

## 5. User Authentication Flow Diagram

```mermaid
sequenceDiagram
    autonumber
    actor Employee
    participant LoginUI as LoginPage (@thestackly.com)
    participant AuthEngine as AuthService
    participant JWT as JWTHandler
    participant AppState as Redux & Router

    Employee->>LoginUI: Enter Email (e.g. maheswari@thestackly.com)
    LoginUI->>LoginUI: Validate @thestackly.com Domain
    Employee->>LoginUI: Request 6-digit OTP Code
    LoginUI->>AuthEngine: Dispatch OTP Generation Request
    AuthEngine-->>LoginUI: OTP Dispatched (60s Resend Timer)
    Employee->>LoginUI: Submit 6-digit OTP Code
    LoginUI->>AuthEngine: Verify Credentials & OTP
    AuthEngine->>JWT: Generate JWT Token & Session Refresh Token
    JWT-->>AppState: Save Bearer Token & User Profile in Redux
    AppState-->>LoginUI: Role Detected & Permission Matrix Loaded
    LoginUI-->>Employee: Redirect to Role Home (/admin/dashboard)
```
