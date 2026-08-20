# Database Checks Before Development/Production

This document outlines the core database verification guidelines and checklist for the Workforce Analytics MongoDB architecture, matching the project standards.

---

## 1. Data Normalization
- **Distinct Collections:** Separate collections exist for `users`, `employees`, `attendancerecords`, `correctionrequests`, `breaksessions`, and `idempotencyrecords`.
- **References:** Relational records use matching primary `id` or `employeeId` fields rather than duplicating embedded profiles inside multiple parent collections.
- **Constraints:** Mongoose schemas enforce types, required attributes, and defaults.

---

## 2. Index Configuration
- **Lookup Indexes:** Indexes are configured on frequently searched and filtered properties:
  - `User.js` -> `id` (unique), `email` (unique), `companyId`
  - `Attendance.js` -> `id` (unique), `employeeId`, `date`, `companyId`
  - `Correction` -> `id` (unique), `employeeId`, `date`, `companyId`
- **Compound unique Indexes:** `{ companyId: 1, key: 1 }` is indexed on `IdempotencyRecord` to prevent transaction replays.
- **TTL Indexes:** `expiresAt` on `IdempotencyRecord` is a TTL index (`expires: 0`) to clean up records automatically.

---

## 3. Pagination Implementation
- **API Page & Limit Checks:** Controllers and services (e.g., `employee.service.js`) implement pagination:
  ```javascript
  const page = Math.max(1, parseInt(queryParams.page, 10) || 1);
  let limit = parseInt(queryParams.pageSize || queryParams.limit, 10) || 25;
  ```
- **Paginated Metadata:** Responses return structured metadata:
  ```json
  {
    "employees": [...],
    "pagination": {
      "page": 1,
      "pageSize": 25,
      "totalItems": 250,
      "totalPages": 10
    }
  }
  ```

---

## 4. Database Migrations
- **Mongoose Schema Tracking:** Schema migrations and model changes must be versioned inside files in the `backend/src/models/` folder.
- **Change Log:** Never alter schemas directly in MongoDB Atlas without committing the updated schema model change to code.

---

## 5. Backup & Restore Policy
- **MongoDB Atlas Backup:** Enabled continuous snapshots and backup logs inside MongoDB Atlas.
- **Retention:** Configure daily snapshots with a 7-day retention window.
- **Recovery Testing:** Periodically test restore procedures by spinning up temporary clusters to restore Atlas backups.

---

## 6. Query Optimization
- **Projection Filtering:** Avoid fetching unnecessary fields; ensure sensitive fields (like password hashes) are excluded from standard API responses.
- **N+1 Avoidance:** Utilize aggregate or path-populated queries instead of querying MongoDB in loops.

---

## 7. Data Integrity Rules
- **Schema Validation:** Enforces strict validation at both the Express validation middleware layer and Mongoose schema level.
- **Transactions:** Multi-collection operations should use Mongoose transactions where session state is active.
