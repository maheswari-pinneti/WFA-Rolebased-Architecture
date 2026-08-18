# 🗄️ Database Architecture

This document describes the SQLite relational structure, table relationships, constraints, and data domains in the Workforce Analytics system.

## 1. Entity Relationship (ER) Diagram

```mermaid
erDiagram
    ORGANIZATIONS ||--o{ DEPARTMENTS : contains
    ORGANIZATIONS ||--o{ USERS : owns
    ORGANIZATIONS ||--o{ EMPLOYEES : employs
    DEPARTMENTS ||--o{ TEAMS : contains
    DEPARTMENTS ||--o{ EMPLOYEES : assigns
    TEAMS ||--o{ EMPLOYEES : contains
    USERS }o--|| ROLES : has
    ROLES }o--o{ PERMISSIONS : grants
    USERS ||--o| EMPLOYEES : maps_to
    EMPLOYEES ||--o{ ATTENDANCE : records
    EMPLOYEES ||--o{ ATTENDANCE_CORRECTIONS : requests
    USERS ||--o{ NOTIFICATIONS : receives
    USERS ||--o{ MFA_CHALLENGES : verifies
    USERS ||--o{ SESSIONS : owns
    USERS ||--o{ AUDIT_LOGS : generates

    ORGANIZATIONS {
        int id PK
        string name
        string status
    }
    USERS {
        int id PK
        int organization_id FK
        int role_id FK
        string email "UK"
        string password_hash
        string status
    }
    ROLES {
        int id PK
        string name "UK"
    }
    PERMISSIONS {
        int id PK
        string resource
        string action
    }
    EMPLOYEES {
        int id PK
        int organization_id FK
        int department_id FK
        int team_id FK
        string employee_code "UK"
        string name
        string designation
        string email
        string location
        string employment_status
        date joining_date
    }
    DEPARTMENTS {
        int id PK
        int organization_id FK
        string name
    }
    TEAMS {
        int id PK
        int department_id FK
        string name
    }
    ATTENDANCE {
        int id PK
        int employee_id FK
        datetime check_in
        datetime break_start
        datetime break_end
        datetime check_out
        string status
    }
    ATTENDANCE_CORRECTIONS {
        int id PK
        int employee_id FK
        date attendance_date
        string reason
        string status
    }
    MFA_CHALLENGES {
        int id PK
        int user_id FK
        string otp_hash
        datetime expires_at
        string status
    }
    SESSIONS {
        int id PK
        int user_id FK
        string refresh_token
        datetime expires_at
        string status
    }
    NOTIFICATIONS {
        int id PK
        int user_id FK
        string type
        string message
        boolean read
        datetime created_at
    }
    AUDIT_LOGS {
        int id PK
        int user_id FK
        string event_type
        string resource
        string action
        string metadata
        datetime created_at
    }
```
