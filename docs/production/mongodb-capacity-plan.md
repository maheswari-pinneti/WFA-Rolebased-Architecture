# MongoDB 500 MB Capacity Plan

500 MB is sufficient for initial 500-employee testing, but it is not unlimited production capacity. We must control what we store and monitor how quickly the database grows.

## 1. Database Growth Vectors

500 employee records themselves are relatively small. The database grows much faster from:
- Attendance records
- Login/audit logs
- Real-time activity
- Notifications
- API logs
- Uploaded files
- Reports
- Historical analytics
- Large embedded documents

```text
500 Employees
       ↓
Employee collection
       ↓
Attendance
       ↓
Daily records
       ↓
Audit logs
       ↓
Notifications
       ↓
Activity history
       ↓
Database growth
```

---

## 2. Storage Strategy

Use the 500 MB MongoDB tier primarily for:
- Users & Employees
- Departments & Roles
- Attendance & Corrections
- Basic audit records
- Authentication & Sessions
- Configuration

### File Storage Separation
Avoid storing large files directly in MongoDB (e.g., employee profile photos, PDF reports, CSV files). Instead:
```text
Frontend -> Backend -> Object/File Storage -> Store only URL + metadata in MongoDB
```

---

## 3. Audit Log Compression
Keep audit records compact. Avoid storing unnecessary request headers, stack traces, or entire user objects.
```json
{
  "userId": "EMP-001",
  "action": "LOGIN",
  "ip": "...",
  "timestamp": "2026-08-20T10:44:21.000Z",
  "success": true
}
```

---

## 4. Attendance Record Optimization
With 500 employees, 1 daily attendance record creates approximately 182,500 documents per year. Design attendance to use single daily documents per employee containing sub-document arrays for breaks, rather than separate documents for every activity punch:
```json
{
  "employeeId": "EMP-001",
  "date": "2026-08-20",
  "checkIn": "...",
  "checkOut": "...",
  "totalHours": 8,
  "breaks": [
    {
      "start": "...",
      "end": "..."
    }
  ]
}
```

---

## 5. Real-Time Event Filtering
Do not persist short-lived transient WebSocket/UI events (e.g. user mouse movements, dashboard open triggers). Only store persistent transactions (like actual checkout, check-in, or critical security audits).

---

## 6. Data Retention Policy

| Data | Retention |
| :--- | :--- |
| Active employees | Indefinite while active |
| Attendance | Organization policy |
| Audit logs | Organization/security policy |
| Temporary tokens | Minutes/hours |
| Password-reset tokens | Very short |
| Real-time events | Don't retain unnecessarily |
| Temporary exports | Delete automatically |
| Application logs | Limited retention |

---

## 7. TTL Indexes
Implement MongoDB Time-to-Live (TTL) indexes for automatic deletion of expired temporary records:
- Password reset tokens
- OTP codes
- Temporary sessions / Idempotency keys

---

## 8. Credentials Protection
Never store credentials (passwords, OTPs, reset tokens, secrets) in plaintext. Always use a strong hashing algorithm (like bcrypt or Argon2id).

---

## 9. Storage Monitoring Thresholds
Configure production alerts to monitor capacity growth:
- **0–60%**: Normal
- **60–75%**: Monitor
- **75–85%**: Warning
- **85–90%**: Critical planning
- **90%+**: Immediate action

---

## 10. Operational Procedure at 500 MB Limit
If the warning threshold is reached, execute the following protocol:
1. Check collection sizes and indexes.
2. Identify the largest growth vectors (logs, historical attendance).
3. Apply the retention policy to clean expired data.
4. Archive older historical data to lower-cost storage.
5. Initiate database capacity expansion.

---

## 11. 500-User Load Testing Strategy
Load testing must be executed on a separate staging/test database so as not to pollute production storage with test metrics.

### Test Profiles
- **Phase A**: 50 users
- **Phase B**: 100 users
- **Phase C**: 250 concurrent users
- **Phase D**: 500 concurrent users
- **Phase E**: 750 concurrent users
- **Phase F (Spike)**: 100 → 500 users rapidly
- **Phase G (Soak)**: 250–500 users for several hours
