# Role-Based Access Control (RBAC) Architecture

## RBAC Model
The platform implements granular role-based access control based on five roles:
1. `ADMIN`: System configuration, role management, full access.
2. `HR`: Employee management, attendance control, organization analytics.
3. `TEAM_MANAGER`: Team productivity analytics, performance reviews, team reports.
4. `TEAM_LEAD`: Team operational tracking and project execution.
5. `EMPLOYEE`: Self profile, attendance clocking, personal performance.

## Key Enforcement
- `<RoleGuard allowedRoles={[Role.ADMIN]} requiredPermission={Permission.USERS_READ}>` wraps sensitive components and routes.
- `usePermission()` hook grants declarative access checks (`canAccess`, `isRoleAllowed`).
