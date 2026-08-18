# Workforce Analytics Database Directory

This directory is designated for database documentation and design guidelines.

The application persistence layer is built on **MongoDB** using Mongoose for schemas and object modeling.

## Development Database & Fallback

To support a seamless, zero-config local development setup:
- **In-Memory Fallback**: If the `MONGODB_URI` environment variable is not defined or is left empty in your `.env` file, the server will automatically spin up a temporary, in-memory MongoDB server using `mongodb-memory-server`.
- **Automatic Seeding**: When starting up in development mode, the server will automatically seed the in-memory database with initial organizations, departments, teams, shifts, and 250 mock employees.

For production or persistent local development, you should define a valid connection string in `.env`:
```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/?retryWrites=true&w=majority
MONGODB_DB_NAME=workforce
```

## Collections & Schemas

The application schema is mapped inside Mongoose models at `backend/src/models/`:
- `User`: Company authorization profiles, clearance levels, status, and multi-factor credentials.
- `Employee`: Complete workforce records, designations, departments, locations, and hiring metadata.
- `Attendance`: Shift assignments, daily punch logs, geofencing coordinates, breaks, and corrections request states.
- `Department`: Department configurations, teams, shifts, tasks, skills, performance records, and leave request states.
- `RefreshToken`: Active sessions, IP details, and refresh token families.
- `AuditLog`: Complete system transaction logs.

