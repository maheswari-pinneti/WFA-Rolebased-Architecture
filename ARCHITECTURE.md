# ⚡ Workforce Analytics Intelligence Platform - System Architecture Index

This index guides you through the official, enterprise-grade architecture and operational flow of the **Workforce Analytics Platform**. 

Instead of general or generic designs, these diagrams are mapped specifically to the actual structures implemented inside the repository (React frontend, Node/Express backend, and SQLite database).

---

## 🏗️ Core Architecture Diagrams

Detailed architectural layouts explaining component layout, system layers, and boundaries.

* **[01. Overall System Architecture](file:///c:/Users/91970/Documents/MAHE/OneDrive/Desktop/WFA-Rolebased-Architecture-main/docs/architecture/01-overall-system-architecture.md)**
  * Details the full stack presentation $\rightarrow$ API $\rightarrow$ business/auth logic $\rightarrow$ database persistence path, including the real-time Socket.IO communication loops.
* **[02. Frontend Client Architecture](file:///c:/Users/91970/Documents/MAHE/OneDrive/Desktop/WFA-Rolebased-Architecture-main/docs/architecture/02-frontend-architecture.md)**
  * Details React SPA component hierarchy, route guards, Redux and React Query state integration, MUI custom layout modules, and role routing limits.
* **[03. Backend Service Architecture](file:///c:/Users/91970/Documents/MAHE/OneDrive/Desktop/WFA-Rolebased-Architecture-main/docs/architecture/03-backend-architecture.md)**
  * Details Express API design, security middleware flows, validation schemes, background worker event emitters, audit triggers, and service layers.
* **[04. Database Persistence Architecture (ERD)](file:///c:/Users/91970/Documents/MAHE/OneDrive/Desktop/WFA-Rolebased-Architecture-main/docs/architecture/04-database-architecture.md)**
  * Relational Entity Relationship Diagram (ERD) defining schemas, PK/FK links, unique constraints, and entities like Organizations, Departments, Users, Employees, and Attendance logs.

---

## 🔄 Runtime Flowcharts

Runtime behavior maps showing the step-by-step logic, requests, and transactions inside the codebase.

* **[01. Frontend Runtime Flow](file:///c:/Users/91970/Documents/MAHE/OneDrive/Desktop/WFA-Rolebased-Architecture-main/docs/flowcharts/01-frontend-flow.md)**
  * Shows user bootstrap, login verification, multi-factor token storage, and dynamic dashboard UI updates.
* **[02. Backend API Middleware Flow](file:///c:/Users/91970/Documents/MAHE/OneDrive/Desktop/WFA-Rolebased-Architecture-main/docs/flowcharts/02-backend-api-flow.md)**
  * Traces the security chain: token parsing $\rightarrow$ JWT checks $\rightarrow$ role guards $\rightarrow$ permission evaluations $\rightarrow$ business logic $\rightarrow$ audit writes.
* **[03. Authentication & MFA Sequence](file:///c:/Users/91970/Documents/MAHE/OneDrive/Desktop/WFA-Rolebased-Architecture-main/docs/flowcharts/03-authentication-mfa-flow.md)**
  * Sequences credentials validation, corporate domain filtering, OTP generation (simulated in logs), user input verification, and session token generation.
* **[04. Attendance geofencing & Sync Flow](file:///c:/Users/91970/Documents/MAHE/OneDrive/Desktop/WFA-Rolebased-Architecture-main/docs/flowcharts/04-attendance-flow.md)**
  * Maps physical check-in actions, coordinates checks inside office geofencing ranges, local offline queue caching, duplicate punch prevention, and Socket.IO dashboard synchronization.
* **[05. Database Transaction Flow](file:///c:/Users/91970/Documents/MAHE/OneDrive/Desktop/WFA-Rolebased-Architecture-main/docs/flowcharts/05-database-flow.md)**
  * Shows query structures, constraint logic, transaction rollbacks/commits, workforce KPI aggregations, and audit schema saves.
* **[06. Complete End-to-End System Loop](file:///c:/Users/91970/Documents/MAHE/OneDrive/Desktop/WFA-Rolebased-Architecture-main/docs/flowcharts/06-end-to-end-flow.md)**
  * Full-circle request loop from User Interaction down to Database persistence, and live updates returning to the UI.
