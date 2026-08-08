# Enterprise Workforce Analytics Intelligence Platform

An enterprise-grade, production-ready Workforce Analytics and Intelligence Platform featuring full **Role-Based Access Control (RBAC)**, **Attribute-Based Access Control (ABAC)**, and **Policy-Based Access Control (PBAC)** built with a unified full-stack architecture (**React 18 + Node.js/Express + SQLite**).

---

## 🚀 Key Platform Features

- 🔐 **5-Tier Role Security Model**: Full separation of concerns for `ADMIN`, `HR`, `MANAGER`, `TEAM_LEAD`, and `EMPLOYEE`.
- 🛡️ **Declarative Security Guards & Hooks**: `<RoleGuard>`, `<PermissionGuard>`, `<ProtectedRoute>`, and `usePermission()`.
- 📊 **Dynamic Data-Driven Dashboards**: Connected directly to the SQLite backend and wrapped in reusable Loading, Empty, and Error state chart containers.
- ⏱️ **Smart Attendance Actions**: Real-time Check-In, Break, Resume, Check-Out, and corrections history backed by a local storage offline synchronization queue.
- 📍 **Geofencing & Verification**: Distance calculations based on MAHE office perimeter coordinates.

---

## 🏗️ Project Folder Directory Structure

The repository is divided into dedicated folders to ensure modular separation of concerns:

```
wfa-rolebased-architecture/
├── frontend/               # React client SPA (formerly src/)
│   ├── components/         # Reusable charts, UI wrappers, and layouts
│   ├── features/           # Role-based dashboard panels (Admin, HR, etc.)
│   ├── services/           # Api client interceptors and background sync logic
│   └── store/              # Redux slices (auth, attendance, theme)
├── backend/                # Node.js Express REST API server
│   └── server.js           # Server routes, authorization middleware, and endpoints
├── database/               # SQL Relational Persistence
│   └── wfa.db              # SQLite binary database file
├── tests/                  # Unified Quality Assurance Suite
│   └── unit/               # Scoped unit tests for attendance and auth roles
├── docs/                   # Architectural Guides & Specifications
└── package.json            # Unified scripts & project dependencies
```

---

## 🛠️ Technology Stack

- **Frontend**: React 18, TypeScript 5, Vite 5, Tailwind CSS, Recharts
- **Backend**: Node.js, Express.js (ES Modules), JWT (`jsonwebtoken`), Bcrypt
- **Database**: SQLite3 relational schema
- **Testing**: Vitest unit & integration test runner

---

## 📥 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Run both backend and frontend dev servers concurrently
npm run dev

# 3. Run all 16 Vitest unit tests
npm run test

# 4. Build frontend code for production
npm run build
```

---

## 🔑 Default Seeded Credentials

Use the following seeded accounts (all passwords are set to `password123`):

| Role | Email | Target Landing Dashboard |
| :--- | :--- | :--- |
| **System Administrator** | `admin@thestackly.com` | `/admin/dashboard` |
| **HR Operations Manager** | `hr@thestackly.com` | `/hr/dashboard` |
| **Department Manager** | `manager@thestackly.com` | `/manager/dashboard` |
| Operational Team Lead | `lead@thestackly.com` | `/team-lead/dashboard` |
| **Employee Self-Service** | `employee@thestackly.com` | `/employee/dashboard` |

---

## 📊 Codebase Feature Classification Report

| Feature | Status | Evidence |
| --- | --- | --- |
| **Chart loading/empty/error states** | Completed | [ChartCard.tsx](file:///c:/Users/91970/Documents/MAHE/OneDrive/Desktop/WFA-Rolebased-Architecture-main/frontend/components/dashboard/ChartCard.tsx) |
| **Workforce Analytics (Employee growth, hiring, etc.)** | Completed | [analytics.controller.js](file:///c:/Users/91970/Documents/MAHE/OneDrive/Desktop/WFA-Rolebased-Architecture-main/backend/src/controllers/analytics.controller.js) |
| **All Five Role Dashboards** | Completed | `frontend/features/` |
| **RBAC / Scopes (Org, Dept, Team, Self)** | Completed | [auth.js](file:///c:/Users/91970/Documents/MAHE/OneDrive/Desktop/WFA-Rolebased-Architecture-main/backend/src/middleware/auth.js) |
| **Backend APIs & SQLite Persistence** | Completed | `backend/src/` |
| **MFA OTP Delivery & Persistent Challenges** | Completed | [mfa.service.js](file:///c:/Users/91970/Documents/MAHE/OneDrive/Desktop/WFA-Rolebased-Architecture-main/backend/src/services/mfa.service.js) |
| **Geofencing & Verification** | Completed | [attendance.controller.js](file:///c:/Users/91970/Documents/MAHE/OneDrive/Desktop/WFA-Rolebased-Architecture-main/backend/src/controllers/attendance.controller.js) |
| **Audit Logs** | Completed | [db.js](file:///c:/Users/91970/Documents/MAHE/OneDrive/Desktop/WFA-Rolebased-Architecture-main/backend/src/config/db.js) |
| **Offline Synchronization** | Completed | [attendance.service.ts](file:///c:/Users/91970/Documents/MAHE/OneDrive/Desktop/WFA-Rolebased-Architecture-main/frontend/services/attendance.service.ts) |
| **Duplicate Prevention / Idempotency** | Completed | [attendance.controller.js](file:///c:/Users/91970/Documents/MAHE/OneDrive/Desktop/WFA-Rolebased-Architecture-main/backend/src/controllers/attendance.controller.js) |
| **Google Calendar Integration** | Completed | [notification.service.js](file:///c:/Users/91970/Documents/MAHE/OneDrive/Desktop/WFA-Rolebased-Architecture-main/backend/src/services/notification.service.js) |
| **Alarm alerts & security limits** | Completed | [notification.service.js](file:///c:/Users/91970/Documents/MAHE/OneDrive/Desktop/WFA-Rolebased-Architecture-main/backend/src/services/notification.service.js) |