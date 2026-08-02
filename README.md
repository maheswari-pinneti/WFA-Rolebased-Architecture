# Enterprise Workforce Analytics Intelligence Platform

An enterprise-grade, production-ready Workforce Analytics and Intelligence Platform featuring full **Role-Based Access Control (RBAC)**, **Attribute-Based Access Control (ABAC)**, and **Policy-Based Access Control (PBAC)** built with **React 18**, **TypeScript**, **Redux Toolkit**, **React Router v6**, and **Vite**.

---

## 🚀 Key Platform Features

- 🔐 **5-Tier Role Security Model**: Full separation of concerns for `ADMIN`, `HR`, `MANAGER`, `TEAM_LEAD`, and `EMPLOYEE`.
- 🛡️ **Declarative Security Guards & Hooks**: `<RoleGuard>`, `<PermissionGuard>`, `<ProtectedRoute>`, `usePermission()`, and `DataScopeEvaluator`.
- 📊 **Dedicated Enterprise Dashboards & Pages**:
  - **Admin**: User Management, Role Management, Permissions Matrix, Department Budgeting, Global Locations, Security Audit Trail, System Configuration.
  - **HR**: Workforce Directory, Attendance Monitoring, Talent Recruitment Pipeline, Leave Policy Management, Monthly Payroll Ledgers.
  - **Manager**: Department Overview, Team Analytics, Attendance & Leave Approvals, Performance Reviews, Team Productivity.
  - **Team Lead**: Task Monitoring, Attendance Tracking, Sprint Productivity, 1-on-1 Feedback Tracker.
  - **Employee**: Personal Portal, Attendance Punch, Leave Applications, OKRs & Goal Progress, Confidential Payslip Downloads.
- 🔍 **Interactive Navigation**: Dynamic categorized sidebar navigation with search filter, badge counters, and `localStorage` state persistence.
- 🎨 **Modern Glassmorphic Design System**: Dark/Light mode theme engine, vibrant HSL gradients, and responsive layouts.

---

## 🏗️ Project Architecture Map

```
src/
├── api/
│   ├── endpoints/          # Domain API endpoints (auth, dashboard, employee, user)
│   └── interceptors/       # Axios & HTTP request token interceptors
├── app/
│   ├── providers/          # Global AppProvider & Redux store provider
│   ├── routes/             # AppRoutes with 100% dedicated page resolution
│   └── store/              # Redux Toolkit store & root reducers
├── auth/                   # Authentication hooks, slices, and login/logout views
├── components/             # Reusable domain tables and Stackly branding
├── design-system/          # Theme tokens and CSS variables
├── enums/                  # System domain enums (EmploymentStatus, LeaveStatus, etc.)
├── features/               # Domain feature modules (admin, hr, manager, team-lead, employee, analytics)
├── interfaces/             # API response wrappers & paginated result types
├── security/               # Core security engines, guards, policies, and data scoping
├── services/               # ApiService, StorageService, and logger utilities
├── shared/                 # Reusable DataTable, Loader, FilterBar, constants, and hooks
├── store/                  # Root Redux store export
└── types/                  # Domain type models (UserProfile, Department, LocationItem, etc.)
```

---

## 🛠️ Tech Stack

- **Core**: React 18, TypeScript 5, Vite 5
- **State Management**: Redux Toolkit 2, React-Redux 9
- **Routing**: React Router v6
- **Styling**: Vanilla CSS Variables, Lucide React Icons, Emotion / MUI
- **Data Visualization**: Recharts

---

## 📥 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev

# 3. Type check & build production bundle
npm run build
```

---

## 🔑 Role Credentials

| Role | Role Key | Landing Page |
| :--- | :--- | :--- |
| **System Administrator** | `ADMIN` | `/admin/dashboard` |
| **HR Operations Manager** | `HR` | `/hr/dashboard` |
| **Department Head / Manager** | `MANAGER` | `/manager/dashboard` |
| **Operational Team Lead** | `TEAM_LEAD` | `/team-lead/dashboard` |
| **Employee Self-Service** | `EMPLOYEE` | `/employee/dashboard` |