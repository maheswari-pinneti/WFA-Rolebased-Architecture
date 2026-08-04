# Workforce Analytics Enterprise Architecture & UI/UX Technical Specification

**Document Metadata**
- **Document Type**: Solution Architecture Specification
- **Audience**: Architecture Review Board, Engineering, Security, Product and Stakeholders
- **Status**: Production Implementation Baseline
- **Version**: 1.0
- **Prepared For**: Workforce Analytics Dashboard Program
- **Prepared By**: Reddi Uday Kumar, Team Lead
- **Date**: 4 August 2026

---

## 1. Executive Architecture Decisions

- **Application Style**: Modular React Frontend + DDD Modular Backend (Monolithic baseline with bounded contexts).
- **UI Pattern**: MVP (Model-View-Presenter) with Typed ViewState.
- **Data Access**: Repository + Unit of Work (scoped queries, transactions, caching).
- **Authorization**: RBAC + DBAC + PBAC (Deny by default).
- **Analytics**: CQRS-style read models & warehouse separation.
- **Integration**: REST API + Domain Events.

---

## 2. Design System Color Tokens (Section 18)

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

## 3. Responsive 12-Column Layout Rules (Section 17)

- **Desktop (`>= 1280px`)**: 12 columns; 4 KPI cards/row; 8+4 chart split; persistent sidebar (`264px` expanded / `72px` collapsed).
- **Tablet (`768px - 1279px`)**: 8 columns; 2 KPI cards/row; charts stack when labels collide; overlay sidebar.
- **Mobile (`< 768px`)**: 4 columns; 1 KPI card/row; filters in drawer; horizontal scroll for tables.

---

## 4. Full Permission & Scope Matrix (Section 13)

| Permission | Admin | HR Manager | Dept Manager | Team Lead | Employee |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `USER_CREATE` | Allow | Deny | Deny | Deny | Deny |
| `USER_UPDATE` | Allow | Deny | Deny | Deny | Self Profile Only |
| `USER_DELETE` | Allow | Deny | Deny | Deny | Deny |
| `USER_VIEW` | Allow | Scoped | Scoped | Team Scoped | Self |
| `EMPLOYEE_VIEW` | Allow | Scoped | Department Scoped | Team Scoped | Self |
| `EMPLOYEE_UPDATE` | Allow | Scoped | Limited Scoped | Deny | Self Fields Only |
| `ATTENDANCE_APPROVE` | Allow | Scoped | Department Scoped | Team Scoped | Deny |
| `PERFORMANCE_VIEW` | Allow | Scoped | Department Scoped | Team Scoped | Self |
| `REPORT_EXPORT` | Allow | Scoped | Department Scoped | Limited / Policy | Personal Only |
| `PAYROLL_VIEW` | Allow | Scoped / Policy | Deny | Deny | Self Payslip |
| `SYSTEM_CONFIGURATION` | Allow + Step-up MFA | Deny | Deny | Deny | Deny |

---

## 5. Navigation & Representative Routes (Section 16)

- **Admin**: `/admin/dashboard`, `/admin/users`, `/admin/roles`, `/admin/departments`, `/admin/reports`, `/admin/audit-logs`, `/admin/settings`
- **HR Manager**: `/hr/dashboard`, `/hr/employees`, `/hr/recruitment`, `/hr/attendance`, `/hr/leave`, `/hr/performance`, `/hr/analytics`, `/hr/reports`
- **Department Manager**: `/manager/dashboard`, `/manager/team`, `/manager/attendance`, `/manager/leave-requests`, `/manager/performance`, `/manager/analytics`
- **Team Lead**: `/team/dashboard`, `/team/members`, `/team/attendance`, `/team/goals`, `/team/analytics`
- **Employee**: `/me/dashboard`, `/me/profile`, `/me/attendance`, `/me/leave`, `/me/performance`, `/me/notifications`
- **Shared**: `/login`, `/verify-email`, `/mfa`, `/forgot-password`, `/unauthorized`, `/session-expired`, `/not-found`
