# Workforce Analytics Intelligence Platform - Production Reliability & Hardening Guide

This document describes the production-hardening design decisions and operational parameters implemented to support up to 250 concurrent active users.

## 1. Database Resiliency & Optimization (SQLite)

Although SQLite is a single-file database, it is highly optimized for local/embedded production workloads under proper configurations:

* **WAL Mode (Write-Ahead Logging)**: Configured via `PRAGMA journal_mode = WAL;`. WAL allows readers to read from the database while a writer is concurrently writing, which eliminates read/write resource starvation under load.
* **Busy Timeout (10 Seconds)**: Set via `PRAGMA busy_timeout = 10000;`. If database lock conflicts occur, SQLite automatically waits up to 10 seconds for the lock to clear rather than throwing an immediate error.
* **Exponential Backoff Retries**: All queries are run through an `executeWithRetry` helper. In case of transient `SQLITE_BUSY` or `SQLITE_LOCKED` states, the database layer retries execution using exponential backoff (e.g. 50ms, 100ms, 200ms...) up to 5 times.
* **Indexing Strategy**: High-traffic lookups and dashboard aggregate endpoints are backed by dedicated indices:
  * Single column indices: `users(email)`, `employees(employeeCode)`, `attendance_records(employeeId)`, `attendance_records(date)`, `audit_logs(timestamp)`
  * Composite indices: `attendance_records(employeeId, date)` to accelerate dashboard and timeline queries.

---

## 2. API Protection & Rate Limiting

To avoid denial of service and resource saturation, Express API rate limits are applied:
* **Global API Limit**: Configured at 5,000 requests per minute per IP to absorb spikes of multiple dashboard analytics queries per page.
* **Authentication Limit**: Tightened to 30 requests per minute per IP for `/auth/login`, `/auth/mfa-verify`, etc., preventing brute force attempts.
* **Refresh Token Limit**: Capped at 100 requests per minute per IP.

---

## 3. Real-Time Socket.IO Channel Protection

Socket connections are hardened using:
* **JWT Authentication**: Enforced via handshake authentication middleware on connection setup.
* **Scope-based Room Subscriptions**: Room subscriptions (`join-room`) are authorized by team, department, or user ID scope. Non-admin users are blocked from joining external rooms.
* **Event Rate Limiting & Filtering**: Throttling caps socket event messages to 20 per second per socket. Rapid duplicate events sent within 50ms are filtered.

---

## 4. Graceful Shutdown & Health Checks

* **Health Endpoints**:
  * `/live`: Simple liveness probe checking process health.
  * `/ready`: Readiness check verifying SQLite database integrity and connection health.
* **Graceful Exit**: On `SIGINT`/`SIGTERM`, the application stops accepting new HTTP connections, closes Socket.IO rooms, drains active HTTP requests, releases SQLite pools, and exits cleanly.
