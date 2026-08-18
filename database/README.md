# Workforce Analytics Database Directory

This directory is designated for database documentation only.

All application transactions, authentication credentials, organizational models, and workforce metrics are hosted in **MongoDB Atlas** (Cloud Database).

## Collections & Schemas

The application schema is mapped inside Mongoose models at `backend/src/models/`:
- `User`: Company authorization profiles, clearance levels, status, and multi-factor credentials.
- `Employee`: Complete workforce records, designations, departments, locations, and hiring metadata.
- `Attendance`: Shift assignments, daily punch logs, geofencing coordinates, breaks, and corrections request states.
- `Department`: Department configurations, teams, shifts, tasks, skills, performance records, and leave request states.
- `RefreshToken`: Active sessions, IP details, and refresh token families.
- `AuditLog`: Complete system transaction logs.
