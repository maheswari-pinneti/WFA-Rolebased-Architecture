# Task 14 SQLite and Full-Stack Audit

**Audit date:** 2026-08-18  
**Scope:** current repository on `main`, active SQLite database `database/wfa.db`, frontend, backend, migrations, seeds, APIs, tests, environment files, and documentation.  
**Mode:** audit only. No application source, migration, seed, or database data was modified during this audit.  
**Sensitive-data handling:** passwords, password hashes, JWT secrets, tokens, OTP values, and credential values are intentionally redacted.

## 1. Executive summary

The repository is a working React/Vite + Express + SQLite prototype with a real API path for several employee, attendance, leave, task, analytics, and RBAC scenarios. The active database has 250 employees and the requested five-location distribution. TypeScript compilation checks pass, the previously executed safe test run passed 30/30 tests, and SQLite reports no physical corruption.

It is **not release-ready** for a production workforce platform. The highest-risk blockers are passwordless login, a hard-coded JWT signing secret, an OTP development bypass and disclosure path, wildcard CORS/socket configuration, missing server-side scope coverage on sensitive routes, business data stored in browser `localStorage`, disabled SQLite foreign-key enforcement, an old active schema that is not upgraded by the current migration strategy, and race-prone attendance writes.

The implementation is best described as a partially integrated prototype: some API-backed analytics and workflows are real, while multiple dashboard, report, and analytics pages are static or simulated. The README describes capabilities that are not implemented in executable code.

## 2. Technology-stack findings

| Area | Observed implementation | Finding |
|---|---|---|
| Frontend | React, TypeScript, Vite, Axios/fetch clients, chart components | Real API integration exists, but duplicate API clients and production business state in `localStorage` create competing sources of truth. |
| Backend | Node.js, Express, Socket.IO | API is mounted under `/v1`; startup initializes SQLite asynchronously after routes are mounted; HTTP/socket shutdown is not coordinated. |
| Database | SQLite through `sqlite3`; `database/wfa.db` | Correct database family, but the active schema is older than the runtime schema assumptions and foreign-key enforcement is off. |
| Authentication | JWT, `bcryptjs`, MFA challenge table | Password verification is absent from login; JWT secret is hard-coded; refresh is token re-signing rather than a revocable refresh-token system. |
| Authorization | Role and scope middleware | Useful scope logic exists, but route coverage is incomplete and claims are trusted from the token instead of being reloaded from current database state. |
| Realtime | Socket.IO | Server uses wildcard CORS and does not show authenticated room authorization. |
| Tests | Vitest unit/API tests and one Playwright UI spec | Static/type checks pass; previous safe test run passed 30 tests. Database migrations, schema invariants, concurrency, complete RBAC, and browser journeys are not comprehensively tested. |
| Other databases | No executable MongoDB, Mongoose, PostgreSQL, Firebase, or `pg` usage found | No evidence of a competing production database driver. |

## 3. Readiness calculation

The percentage below uses 17 equally weighted Task 14 condition groups. `Completed` contributes 1 point, `Partial` contributes 0.5 points, and `Mock Only`, `Missing`, `Broken`, and `Unverified` contribute 0 points. A mixed condition is `Partial` only when a meaningful executable path exists; static or simulated behavior is not counted as completed.

| Status | Count |
|---|---:|
| Completed | 0 |
| Partial | 14 |
| Mock Only | 1 |
| Missing | 0 |
| Broken | 2 |
| Unverified | 0 |
| **Total condition groups** | **17** |

**Overall readiness: 41%** (`14 × 0.5 ÷ 17`, rounded).

The zero `Unverified` count is at the condition-group level. Individual unexecuted checks, including the production build and Playwright browser flow, are explicitly marked `Unverified` in the validation section and are not treated as passing.

## 4. Condition-by-condition result and correction matrix

| # | Requirement | Status | Evidence and root cause | Risk | Files | Required correction | Acceptance test |
|---:|---|---|---|---|---|---|---|
| 1 | Controlled SQLite access | Partial | Runtime wrappers exist, but `query_db.js`, data-generation scripts, and the realtime simulator open direct connections to the main database. | Bypassed transactions, inconsistent configuration, accidental production mutation. | `backend/src/config/db.js`, `query_db.js`, `backend/scripts/generate-test-data.js`, `backend/scripts/realtime-workforce-simulator.js` | Export one configured repository/connection service and make every data path use it; prohibit direct main-DB script access. | Static scan finds one approved connection factory only; integration test verifies all writes use the configured test database. |
| 2 | Versioned migrations | Partial | Eleven SQL files exist, but there is no migration-history table, no applied-version tracking, no rollback, and all files use `IF NOT EXISTS`. Runtime initialization also creates/backfills schema independently. | Existing installations can silently retain stale or incomplete schema. | `database/migrations/*.sql`, `backend/src/config/db.js` | Add transactional migration runner with ordered versions, checksums, applied history, failure stop, and documented rollback/forward-fix policy. | Empty database and current database converge to the same schema; a failed migration rolls back and is not marked applied. |
| 3 | Foreign keys and referential integrity | Broken | Read-only check: `PRAGMA foreign_keys` returns `0`; active `wfa.db` has no foreign keys on core tables such as users, employees, attendance, leave, corrections, tasks, skills, performance, shifts, and audit logs. | Orphan records and cross-tenant references can be inserted without database rejection. | `backend/src/config/db.js`, active `database/wfa.db` schema | Enable `PRAGMA foreign_keys = ON` on every connection; rebuild/upgrade tables with required FKs and validate existing data before cutover. | Connection pragma returns `1`; invalid parent deletion/insertion fails; `PRAGMA foreign_key_check` is empty after migration. |
| 4 | Relational schema and constraints | Partial | Tables and indexes exist, but the active schema lacks many expected FKs and has no business `CHECK` constraints. Some runtime constraints only apply to newly created tables. | Invalid roles, statuses, dates, modes, and cross-organization references can be stored. | `database/migrations/*.sql`, `backend/src/config/db.js`, `database/wfa.db` | Define canonical schema, NOT NULL/UNIQUE/CHECK constraints, FK actions, and indexes in migrations; validate every existing table. | Schema snapshot matches the canonical definition and invalid enum/status/date values are rejected. |
| 5 | Seed data and idempotency | Partial | Active counts are correct for employees and locations. Seeds run only when users count is zero; runtime seeding deletes and recreates employee-related data; no migration-safe seed ledger exists. | Re-running initialization can destroy data or produce environment-specific results. | `backend/src/config/db.js`, `database/seeds/*.sql`, `backend/scripts/generate-test-data.js` | Separate immutable reference seeds from generated demo data; use stable upserts and explicit `--reset-demo-data` only. | Two seed runs produce the same counts and keys without deleting unrelated records. |
| 6 | Data integrity and duplicate prevention | Partial | `integrity_check` is `ok`; orphan probes returned zero and employee codes/emails are unique. Two attendance rows exist for the same employee/date, and the check-in flow performs a race-prone select then insert. | Duplicate attendance sessions and inaccurate payroll/reporting. | `backend/src/controllers/attendance.controller.js`, `backend/src/services/attendance.service.ts`, `database/wfa.db` | Add a transaction, durable idempotency contract, state uniqueness rules, and conflict handling. | Concurrent duplicate check-ins yield exactly one record and the same idempotent response. |
| 7 | Password authentication | Broken | Login accepts email and does not read or validate a password hash. Frontend login sends only email. | Anyone able to submit a corporate email can begin authentication. | `backend/src/controllers/auth.controller.js`, `frontend/api/endpoints/auth.api.ts` | Require password input, compare with a stored hash, use generic failure responses, and add lockout/rate-limit policy. | Wrong password cannot issue a token; correct password plus MFA is required where enabled. |
| 8 | Token, MFA, session, and secret security | Broken | JWT signing uses a source literal; MFA has a development acceptance path and logs/discloses challenge material; logout is client-side/stateless; refresh re-signs a token without a stored session. | Token forgery, MFA bypass, credential disclosure, and inability to revoke sessions. | `backend/src/middleware/auth.js`, `backend/src/services/mfa.service.js`, `backend/src/controllers/auth.controller.js`, `frontend/auth/services/auth.service.ts` | Move secrets to validated environment/secret storage, remove bypass and logs, implement hashed one-time challenges with expiry/attempt limits, and persist revocable sessions/refresh tokens. | Secret absence fails closed; OTP can be used once before expiry; logout/revocation invalidates refresh and access policy as designed. |
| 9 | RBAC and data scope | Partial | `enforceScope` covers several employee/analytics paths and tests cover self, department, team, and cross-org cases. `/teams` is authenticated without explicit scope enforcement, and some paths rely on token claims or controller checks. | A valid user may enumerate or mutate records outside the intended organization/team. | `backend/src/middleware/auth.js`, `backend/src/routes/api.routes.js`, controllers under `backend/src/controllers/` | Centralize policy checks at query/service boundaries; reload current role/scope; add scope middleware to every sensitive route, including teams and exports. | Matrix test covers every role × route × same/cross organization case and expects deny by default. |
| 10 | Role dashboards and navigation | Partial | Protected routes exist. `AnalyticsOverview` is API-backed, but admin KPI/activity and team pages contain static values/arrays; HR reports are static. | Users see misleading operational numbers and incomplete workflows. | `frontend/app/routes/AppRoutes.tsx`, `frontend/features/admin/pages/AdminDashboard.tsx`, `frontend/features/admin/pages/TeamsPage.tsx`, `frontend/features/hr/pages/HRReports.tsx` | Replace static values with scoped API query states and remove simulated success actions; add loading/error/empty states to every page. | Each role dashboard displays values traced to a test API response and has tested error/empty states. |
| 11 | Analytics and charts | Partial | `/v1/analytics` performs real SQL and feeds `AnalyticsOverview`; Skills/Risk/Productivity/Performance pages use hard-coded arrays. One scoped mode query uses the wrong identifier (`a.id` instead of `a.employeeId`). | Charts can be fabricated, incorrectly scoped, or mathematically wrong. | `backend/src/controllers/analytics.controller.js`, `frontend/hooks/useAnalyticsData.ts`, `frontend/components/dashboard/AnalyticsOverview.tsx`, `frontend/features/analytics/pages/*.tsx` | Establish typed analytics DTOs, correct scope predicates, derive every chart from API data, and test aggregation/timezone rules. | Seed fixtures with known totals produce exact chart data for each role and filter. |
| 12 | Attendance lifecycle | Partial | Check-in, break, resume, checkout, records, and geofence paths exist; UI also has local state transitions. Validation is incomplete, office coordinates are hard-coded, and server writes are not transactional. | Invalid shifts/modes, timezone errors, duplicate sessions, and inaccurate hours. | `backend/src/controllers/attendance.controller.js`, `backend/src/routes/api.routes.js`, `frontend/services/attendance.service.ts`, `frontend/components/attendance/LiveCheckInWidget.tsx` | Make server the source of truth; validate coordinates, shift/work mode, timezone, state transitions, and idempotency in one transaction. | Full lifecycle and invalid-state matrix passes for normal, overnight, remote, geofenced, and concurrent requests. |
| 13 | Attendance corrections and approvals | Partial | Correction submit/review routes exist, but there is no durable approval history/original snapshot, no multi-stage policy, and nested update behavior is not transactionally coordinated. | Approved corrections may not be auditable or atomically applied. | `backend/src/controllers/attendance.controller.js`, `backend/src/routes/api.routes.js` | Add correction state machine, immutable before/after values, approver identity/time, policy-based manager/HR stages, and transaction boundary. | Rejected, approved, duplicate, and concurrent correction cases preserve a complete audit trail. |
| 14 | Offline sync and idempotency | Partial | Browser queues attendance records in `localStorage`; sync is manual and has no robust reconnect/backoff/dead-letter state. Server idempotency is optional and race-prone. | Lost, duplicated, or stale attendance records during connectivity changes. | `frontend/services/attendance.service.ts`, `frontend/components/attendance/LiveCheckInWidget.tsx` | Use a durable client queue with status/attempt metadata and automatic retry; keep server idempotency authoritative. | Network-disconnect/reconnect test retries safely, reports failure, and never creates a duplicate server record. |
| 15 | Reports and exports | Missing | CSV is generated in the browser from current client data; report export has a fake timeout; HR report download is static. No backend Excel/PDF/report API was found. | Incomplete, unscoped, unaudited exports can leak or misstate data. | `frontend/components/tables/CSVExport.tsx`, `frontend/features/reports/components/ExportReport.tsx`, `frontend/features/hr/pages/HRReports.tsx` | Implement authenticated, scoped, server-generated report jobs with format, filter, audit, and download authorization. | Same filtered dataset is exported as CSV/XLSX/PDF from the server and denies cross-scope requests. |
| 16 | Automated quality coverage | Partial | Current `npm.cmd run lint` and `npm.cmd run typecheck` pass. The previously executed safe Vitest run passed 30/30. Build was not rerun because it writes artifacts; Playwright browser flow was not run. No migration, FK, concurrency, or complete authorization matrix exists. | Regressions in schema, security, and browser workflows can ship undetected. | `package.json`, `tests/unit/*.test.ts`, `tests/e2e-ui.spec.ts`, `playwright.config.ts` | Add CI build, migration/schema tests, concurrency tests, route authorization matrix, and deterministic browser journeys. | CI runs typecheck, build, unit/API, migration, security, and Playwright suites against an isolated disposable database. |
| 17 | Documentation and delivery truth | Partial | README claims password validation, refresh tokens, rate limiting, migration commands, reports, and constraints that executable code does not provide; referenced `.env.example` and migration commands are absent. | Operators and reviewers may deploy with false assumptions. | `README.md`, `ARCHITECTURE.md`, `.env`, `.env.development`, `.env.production`, `package.json` | Update documentation from executable behavior; add safe environment template, startup/migration/runbook, and explicit prototype limitations. | Every documented command and feature is backed by a passing automated check or marked planned/unverified. |

## 5. SQLite architecture audit

### 5.1 Connection and initialization

- `backend/src/config/db.js` creates one `sqlite3.Database` using `DB_NAME` or `wfa.db` and exposes callback-to-promise wrappers.
- The application also has direct database connections in `query_db.js`, `backend/scripts/generate-test-data.js`, and `backend/scripts/realtime-workforce-simulator.js`. This defeats centralized configuration and makes it easy for scripts to mutate the main file.
- `initDb()` runs migrations and runtime schema creation/seed logic, but there is no migration history or schema version check. Migration SQL is split on semicolons and is not a robust SQL migration parser.
- Initialization starts from `app.js` without awaiting completion before the server begins serving requests. Initialization errors are not surfaced through a startup-fail contract.
- Process signal handlers close the database, but the HTTP server and Socket.IO server do not have a coordinated graceful-shutdown sequence.

### 5.2 Sensitive route and scope review

| Route family | Authentication | Scope/role enforcement | Result |
|---|---|---|---|
| `POST /v1/auth/login` | None by design | None | Broken until password verification and rate limiting are implemented. |
| `POST /v1/auth/mfa-verify` | Challenge-based | MFA service | Broken because development fallback/disclosure paths exist. |
| `GET /v1/auth/me` | JWT | Token claims | Partial; claims are not revalidated against current user state. |
| `POST /v1/auth/refresh` | JWT | Token claims | Broken as a revocable refresh-session system; it only re-signs. |
| `GET /v1/employees` and employee CRUD | JWT | `enforceScope` plus permissions on mutations | Partial; query-boundary tests exist, but complete matrix and claim freshness are absent. |
| `GET /v1/teams` | JWT | No explicit `enforceScope` in route | Broken/high-risk scope gap. |
| `GET /v1/teams/:id/members` | JWT | Scope middleware | Partial; controller identifier semantics need verification and query-boundary tests. |
| Attendance lifecycle routes | JWT | Scope on several mutations; `today`/some reads have weaker route coverage | Partial; database transaction and state validation are insufficient. |
| Leave request/review routes | JWT | Scope plus review roles | Partial; persistence is real, but complete cross-org and approval tests are absent. |
| Tasks | JWT | GET scoped; updates rely on auth/controller logic | Partial; update path needs centralized scope enforcement. |
| Corrections | JWT | Scoped submission/get; role-protected review | Partial; no atomic approval history. |
| Analytics/dashboard routes | JWT | `enforceScope` on major analytics paths | Partial; one identifier bug and static frontend consumers remain. |
| Audit log routes | JWT | Admin/HR on exposed API routes | Partial; audit writes are asynchronous and not transactionally tied to mutations. |
| User administration | JWT | Admin role | Partial; token role freshness and organization constraints need database-backed policy checks. |
| Socket.IO connection | Socket server | Wildcard CORS; authenticated room authorization not demonstrated | Broken/high-risk until origin and room access are explicitly enforced. |

### 5.3 Active database inventory

The following is the read-only inventory of `database/wfa.db`. “Active FK” means a foreign key visible through `PRAGMA foreign_key_list()` in the current file, not merely present in a migration or runtime `CREATE TABLE` string.

| Table | Rows | Primary key | Active FK observations | Constraints/index observations | Status |
|---|---:|---|---|---|---|
| `organizations` | 1 | `id` | Referenced by some tables | Basic key only | Partial |
| `users` | 254 | `id` | No active org/employee FK | Email unique; role is free text | Partial |
| `employees` | 250 | `id` | No active org/team/manager FK | Employee code and email unique | Partial |
| `departments` | 6 | `id` | `organizationId → organizations.id` | Code unique; manager relation not enforced | Partial |
| `teams` | 6 | `id` | Organization and department FKs present | Lead relation not enforced | Partial |
| `roles` | 0 | `id` | Referenced by `role_permissions` | Name unique | Partial |
| `permissions` | 0 | `id` | Referenced by `role_permissions` | Name unique | Partial |
| `role_permissions` | 0 | composite role/permission | Role and permission FKs present | Composite primary key | Partial |
| `shifts` | 3 | `id` | No active employee/org FK | Basic fields only | Partial |
| `attendance_records` | 2 | `id` | No active employee FK | Idempotency key unique when present; no state/date checks | Broken |
| `corrections` | 0 | `id` | No active employee/attendance/approver FKs | No approval-state checks/history | Missing |
| `leave_requests` | 26 | `id` | No active employee/approver FKs | No date/status checks | Partial |
| `tasks` | 4 | `id` | No active assignee/org FK | No status/date checks | Partial |
| `skills` | 1,250 | `id` | No active employee FK | Employee index exists; no level/range checks | Partial |
| `performance_records` | 1,000 | `id` | No active employee FK | Employee index exists; score bounds not enforced | Partial |
| `audit_logs` | 780 | `id` | No active actor/org FK | Random IDs and asynchronous insert; no immutability policy | Partial |
| `mfa_challenges` | 5 | `id` | No active user FK | Email index/expiry semantics need enforcement | Partial |
| `notifications` | 0 | `id` | User and organization FKs present | No demonstrated delivery/outbox guarantees | Partial |

System tables such as SQLite sequence/statistics tables are not application entities. No application table with a `CHECK` constraint was found in the active schema. Several indexes exist for email, attendance employee/date, skills employee, and performance employee, but organization/scope and common workflow indexes are incomplete.

### 5.4 Integrity checks executed

| Check | Read-only query | Result | Interpretation |
|---|---|---|---|
| Physical integrity | `PRAGMA integrity_check` | `ok` | SQLite file is not physically corrupt. |
| Enforcement state | `PRAGMA foreign_keys` | `0` | Foreign keys are disabled for the inspected connection/configuration. This is a release blocker. |
| Existing FK violations | `PRAGMA foreign_key_check` | Empty result | No violations were reported under the current schema; this does not prove missing relationships are protected. |
| Duplicate employee codes | `GROUP BY employeeCode HAVING COUNT(*) > 1` | 0 groups | Current data is clean for this invariant. |
| Duplicate user/employee emails | Grouped duplicate probes | 0 groups | Current data is clean for this invariant. |
| Duplicate attendance idempotency keys | Grouped duplicate probe | 0 groups | No duplicate non-null idempotency key currently exists. |
| Duplicate attendance session sample | Group by employee/date | 1 group | Two records exist for one employee/date; this demonstrates the business invariant is not enforced. |
| Manual orphan probes | Attendance, skills, performance, tasks, users, employees, departments, teams, leave joins | 0 observed orphans | Current sample is mostly consistent despite weak database enforcement. |

## 6. Migration and schema findings

### 6.1 Migration inventory

`database/migrations/001_create_organizations.sql` through `011_create_indexes.sql` are present. They use `CREATE TABLE IF NOT EXISTS` and `CREATE INDEX IF NOT EXISTS`; no migration-history table, version ledger, checksum, rollback, or applied-at record exists. The runtime `createSchema()` independently creates and backfills columns, so the SQL files are not the sole source of truth.

The active database has older constraints than the migration/runtime source expects. `IF NOT EXISTS` does not alter an existing table, so adding a `NOT NULL`, `UNIQUE`, `CHECK`, or FK to the code does not upgrade `wfa.db`.

### 6.2 Required migration design

1. Create a migration ledger with version, checksum, applied timestamp, and success state.
2. Run each migration in a controlled transaction where SQLite permits it; use explicit table-rebuild migrations for constraint changes.
3. Set `PRAGMA foreign_keys = ON` before schema/data validation on every connection.
4. Validate existing data and report/remediate violations before enabling stricter constraints.
5. Make startup fail closed if a migration fails or the schema version is unsupported.
6. Keep demo-data reset outside normal startup and require an explicit command/flag.
7. Add an isolated test database for every migration test and never use the tracked main database for tests.

## 7. Seed validation

### 7.1 Read-only seed checks

| Validation | Query shape | Expected | Observed | Result |
|---|---|---:|---:|---|
| Organization/company | `SELECT COUNT(*) FROM organizations` | 1 | 1 | Pass |
| Employees | `SELECT COUNT(*) FROM employees` | 250 | 250 | Pass |
| Bengaluru | `SELECT COUNT(*) FROM employees WHERE location='Bengaluru'` | 60 | 60 | Pass |
| Chennai | `SELECT COUNT(*) FROM employees WHERE location='Chennai'` | 50 | 50 | Pass |
| Hyderabad | `SELECT COUNT(*) FROM employees WHERE location='Hyderabad'` | 70 | 70 | Pass |
| Kochi | `SELECT COUNT(*) FROM employees WHERE location='Kochi'` | 30 | 30 | Pass |
| Visakhapatnam | `SELECT COUNT(*) FROM employees WHERE location='Visakhapatnam'` | 40 | 40 | Pass |
| Employee-code uniqueness | `GROUP BY employeeCode HAVING COUNT(*) > 1` | 0 groups | 0 | Pass |
| Employee-email uniqueness | `GROUP BY email HAVING COUNT(*) > 1` | 0 groups | 0 | Pass |
| User-email uniqueness | `GROUP BY email HAVING COUNT(*) > 1` | 0 groups | 0 | Pass |
| User role distribution | `GROUP BY role` | Expected role rows | ADMIN 1, HR 1, MANAGER 1, TEAM_LEAD 1, EMPLOYEE 250 | Pass for current seed |
| Employee role distribution | `GROUP BY role` | EMPLOYEE 250 | EMPLOYEE 250 | Pass for current seed |
| Roles/permissions catalog | `SELECT COUNT(*) FROM roles/permissions/role_permissions` | Non-empty RBAC catalog expected | All 0 | Fail/Partial |
| Seed idempotency | Two startup seed executions | Same data, no destructive deletion | Not proven; current code deletes/recreates generated data | Unverified/Fail |

### 7.2 Seed risks

- `seedEmployees()` deletes employee-related and reference data before generating deterministic rows. This is not safe as normal application startup behavior.
- SQL seed files execute only when the users table is empty, so a partially populated or damaged database may never receive missing reference data.
- Runtime generated task timestamps use current time, making seed output non-reproducible.
- The active `roles`, `permissions`, and `role_permissions` tables are empty despite a role-aware application. Role strings on users are not a substitute for a populated permission model.
- `generate-test-data.js` contains destructive deletion paths against the main database and uses random data. It must not be an operationally available path.

## 8. Authentication and security audit

### 8.1 Authentication findings

- The login controller accepts an email but does not validate a submitted password against a stored hash. The frontend login request likewise sends only email.
- MFA challenge generation and verification are backed by a table, but development behavior includes an OTP bypass/disclosure path and logging that must not exist in production.
- JWT signing uses a hard-coded source value. The value is not reproduced in this report.
- Logout is recorded as an audit action while the client discards its token. There is no server-side access-token revocation or session state.
- Refresh creates another token from the current token rather than validating a stored, rotated, revocable refresh session.
- The browser stores JWT/user state in `localStorage`; this increases the impact of XSS and is also used for business attendance/correction data.

### 8.2 Security configuration findings

- `cors()` is unrestricted in Express.
- Socket.IO is configured with wildcard origin behavior and no demonstrated authenticated room/tenant authorization.
- Error handling returns `err.message`, which can expose implementation details.
- Rate limiting, account lockout, password policy, CSRF strategy, security headers, and structured secret validation are not demonstrated in executable code.
- Sensitive and business endpoints do not all show explicit scope middleware, particularly the teams collection path and some read endpoints.
- Profile code stores an external provider token/client data in browser storage; this requires a separate token-handling review.

## 9. RBAC and data-scope audit

### Verified strengths

- `authenticateToken`, role authorization, permission authorization, and `enforceScope` middleware exist.
- Existing API tests cover employee self-scope, manager department scope, team-lead team scope, and cross-organization denial for selected endpoints.
- Many employee, attendance mutation, leave, corrections, and analytics routes are explicitly composed with scope middleware.

### Gaps

- `/teams` is protected by authentication but lacks explicit scope enforcement in the route definition.
- Token role/scope claims are trusted for the request rather than reloaded from current user/organization membership.
- Some controllers enforce access through ad hoc checks, which makes policy coverage inconsistent.
- Client-side guards (`ProtectedRoute` and `RoleGuard`) improve navigation but cannot provide authorization.
- Browser CSV export operates on client-visible data and has no server-side export authorization.
- A complete role × route × organization matrix is absent.

## 10. Dashboard and page audit

| Role/page area | Evidence | Data source | Status |
|---|---|---|---|
| Admin dashboard | `frontend/features/admin/pages/AdminDashboard.tsx` contains hard-coded KPI/activity values | Static arrays/constants | Mock Only |
| Admin teams | `frontend/features/admin/pages/TeamsPage.tsx` contains static team data | Static arrays | Mock Only |
| HR reports | `frontend/features/hr/pages/HRReports.tsx` contains an archived report list and fake download action | Static list and timeout | Mock Only |
| HR/manager/team analytics | `AnalyticsOverview` is mounted through role pages and calls the analytics hook/API path | `/v1/analytics` and SQL | Partial/real path |
| Employee attendance | `LiveCheckInWidget` and attendance service provide UI and API methods but retain local business state | API plus browser storage | Partial |
| Role navigation | `AppRoutes.tsx`, `ProtectedRoute.tsx`, and `RoleGuard.tsx` | Route guards | Partial; not an authorization boundary |
| Loading/error/empty states | Analytics chart wrapper accepts loading/error/empty props | Component state | Partial; static pages do not consistently implement it |

## 11. Analytics and chart traceability

| Chart/page | Frontend trace | Backend/data trace | Status |
|---|---|---|---|
| Analytics overview | `AnalyticsOverview.tsx` → `useAnalyticsData.ts` → `analytics.api.ts` | `GET /v1/analytics` → `analytics.controller.js` SQL aggregates | Partial/real |
| Employee/attendance/department/role/status/mode cards | Same analytics path | Scoped SQL in `analytics.controller.js` | Partial; scope and calculation bug review required |
| Skills analytics | `features/analytics/pages/SkillsAnalyticsPage.tsx` | No corresponding API trace; static arrays | Mock Only |
| Risk analytics | `RiskAnalyticsPage.tsx` | No corresponding API trace; static arrays | Mock Only |
| Productivity analytics | `ProductivityAnalyticsPage.tsx` | No corresponding API trace; static arrays | Mock Only |
| Performance analytics | `PerformanceAnalyticsPage.tsx` | No corresponding API trace; static arrays | Mock Only |
| Team analytics page | `features/admin/pages/TeamsPage.tsx` | No corresponding real query trace | Mock Only |

Known calculation concern: one employee-specific mode-distribution branch uses attendance record `a.id` where employee identity is required, which can produce incorrect scoped results. Attendance “late” and date calculations also rely on JavaScript local timezone behavior rather than a documented Asia/Kolkata/domain-time policy.

## 12. Attendance workflow audit

| Workflow | UI | API | SQLite write | Validation/auth | Transaction/idempotency | Tests | Result |
|---|---|---|---|---|---|---|---|
| Check-in | `LiveCheckInWidget` | `POST /v1/attendance/check-in` | Insert attendance row | Auth/scope, employee/shift/work-mode checks, hard-coded office geofence | Select-then-insert race; optional key; no transaction | API lifecycle and geofence tests | Partial |
| Break | Attendance service/widget | `POST /v1/attendance/break` | Update attendance state | Auth; limited state validation | No transaction/state constraint | Basic service tests | Partial |
| Resume | Attendance service/widget | `POST /v1/attendance/resume` | Update attendance state | Auth; limited state validation | No transaction/state constraint | Basic service tests | Partial |
| Checkout | Attendance service/widget | `POST /v1/attendance/checkout` | Update checkout state | Auth; limited state/time validation | No transaction; duration rules split client/server | API test covers simple lifecycle | Partial |
| Today/records | UI and service | `GET /v1/attendance/today`, records | Read | Route scope coverage is inconsistent | N/A | Limited API coverage | Partial |
| Correction submit | Correction UI/service | Correction POST | Insert correction | Auth/scope | No immutable original snapshot or approval history | Not comprehensively tested | Partial |
| Correction review | HR/manager route | Review endpoint | Update correction and attendance | Role route exists | Nested changes not atomic | Not comprehensively tested | Partial |
| Offline queue | Widget/service | Manual sync to API | Browser `localStorage` first | Client-controlled queue | No automatic reconnect/backoff/dead-letter; server key race | Local queue unit test only | Partial |
| Timezone/overnight | Service calculations | No complete server rule | Client-derived durations | Browser local timezone | Cross-midnight and DST/domain rules incomplete | Simple calculation tests only | Unverified/Partial |

## 13. Reports and exports

- `CSVExport.tsx` filters data in the browser and creates a data URI. It is not a server-authorized export and cannot guarantee a complete or current dataset.
- `ExportReport.tsx` uses a delayed success simulation rather than a report API.
- `HRReports.tsx` shows static archived reports and a fake download path.
- No backend Excel, PDF, report-job, export-audit, or scoped download endpoint was found.
- The correction must include server-side filtering, organization/scope authorization, stable column definitions, date/timezone rules, audit logging, and tests for large datasets and unauthorized filters.

## 14. Test and quality audit

### Executed or previously recorded

| Check | Result | Notes |
|---|---|---|
| `npm.cmd run lint` | Pass | Runs `tsc --noEmit`; current re-check passed. |
| `npm.cmd run typecheck` | Pass | Current re-check passed. |
| Vitest | Pass, 30/30 in prior safe run | Covered 4 files: auth, attendance, API/RBAC, and API lifecycle. The run used the configured test database rather than the production database. |
| SQLite integrity | Pass | `PRAGMA integrity_check` returned `ok`. |
| SQLite FK violation scan | Empty result | Not a proof of protection because FK enforcement is off and relationships are missing from the active schema. |

### Not counted as passing

| Check | Status | Reason |
|---|---|---|
| Production build | Unverified | Not rerun because it writes build artifacts and this audit was instructed not to generate/modify application artifacts. Existing `dist` is not proof of a current successful build. |
| Playwright browser suite | Unverified | The UI spec is narrow and was not run against a verified running application in this audit. |
| Migration upgrade/rollback | Missing | No migration ledger or rollback test. |
| Schema/FK/constraint tests | Missing | No automated tests assert canonical schema, connection pragma, or invalid-reference rejection. |
| Concurrency/idempotency | Missing | No race test for attendance check-in or correction review. |
| Full authorization matrix | Partial | Selected scope cases exist; complete route/role/cross-org matrix is absent. |
| Accessibility/responsive/mobile workflow | Unverified | No evidence in the existing test set that verifies these requirements. |

## 15. Environment and configuration audit

- `.env` exists and is tracked; `.env.development` and `.env.production` are empty. No `.env.example` was found despite README references.
- Runtime secrets should be required from environment/secret storage and validated at startup. Development defaults must not be accepted in production.
- `.gitignore` does not ignore environment files or SQLite files. If these files are intended to be local-only, tracking and ignore policy must be corrected after a deliberate repository-history review.
- The Vite proxy targets port 5000 while the development server runs Vite on port 3000; this is coherent for local development, but production deployment configuration is not documented as an executable check.

## 16. P0/P1/P2/P3 correction backlog

### P0 — release blockers (8 issue groups)

1. Require password verification; email-only login must not issue authentication.
2. Remove hard-coded JWT signing material and fail closed when secret configuration is absent.
3. Remove MFA bypasses, OTP logs, and development challenge disclosure; enforce expiry, attempts, and one-time use.
4. Replace stateless logout/re-sign refresh with revocable, rotated sessions and refresh tokens.
5. Enforce organization/team scope on every sensitive route, including teams and exports; deny by default.
6. Stop storing authoritative attendance/correction/audit data in browser `localStorage`.
7. Enable SQLite foreign keys and migrate the active database to a canonical constrained schema.
8. Make attendance writes transactional and race-safe so duplicate sessions cannot be created.

### P1 — required before production pilot (8 issue groups)

1. Add migration history, checksums, failure handling, and a documented rollback/forward-fix policy.
2. Replace destructive startup seeding with idempotent reference seeds and explicit demo reset tooling.
3. Populate and enforce the role/permission model; add missing FKs, `CHECK`s, and scope indexes.
4. Move attendance duration, timezone, overnight, mode, shift, and correction rules to a tested server/domain layer.
5. Implement durable offline queue states, automatic retry/backoff, dead-letter handling, and server idempotency.
6. Replace static dashboard and analytics pages with typed API-backed data and verified empty/error states.
7. Implement authenticated, scoped server-side CSV/XLSX/PDF/report exports with audit records.
8. Add CI build, migration, schema, concurrency, authorization-matrix, and browser tests.

### P2 — hardening and operational correctness

- Restrict CORS and Socket.IO origins; authenticate rooms and tenant membership.
- Add security headers, safe error responses, structured logging, rate limiting, lockout policy, and alerting.
- Add organization/scope indexes and query plans for high-volume attendance/analytics queries.
- Make audit logging transactional with mutations and protect audit records from ordinary edits.
- Remove duplicate API clients and define one frontend data/cache strategy.
- Add accessibility, responsive, mobile, and timezone test fixtures.

### P3 — documentation and maintainability

- Align README and architecture documentation with executable behavior.
- Add `.env.example` containing names only, never secrets.
- Document startup, migration, seed, reset, backup, restore, and test-database procedures.
- Remove or quarantine unused mock pages and destructive scripts from normal developer workflows.

## 17. Recommended implementation order

1. Freeze deployment and correct authentication, secret handling, MFA, sessions, and CORS/socket authorization.
2. Snapshot the current database, validate existing data, and introduce the canonical schema with FK enforcement and migration history.
3. Centralize repository access and transaction boundaries; fix attendance idempotency/concurrency and correction approval history.
4. Enforce scope at query/service boundaries and run the complete authorization matrix.
5. Replace browser-authoritative business state, then implement durable offline synchronization.
6. Replace static dashboards/analytics and implement server-side exports.
7. Add migration/schema/concurrency/security/browser CI gates.
8. Update README/runbooks only after the executable behavior and automated checks agree.

## 18. Final verdict

**NOT READY for production or an unrestricted workforce pilot.**

The current repository is suitable for controlled development/demo use with the database backed up and test data isolated. It is not acceptable as a production system until the P0 security, authorization, SQLite enforcement, and transactional attendance issues are resolved and verified by automated tests. The active employee seed is correct and SQLite is physically healthy, but those facts do not compensate for the authentication, authorization, schema-enforcement, and data-authority gaps.
