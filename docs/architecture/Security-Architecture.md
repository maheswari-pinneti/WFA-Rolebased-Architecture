# Security Architecture

## Principles
- JWT token stored in secure local storage keys (`wfa_auth_token`).
- Token auto-injected into request headers via `authInterceptor`.
- Role authentication enforced at client-side routing via `ProtectedRoute`.
- Dynamic view rendering guarded by `RoleGuard` and `usePermission` evaluation against immutable `PERMISSION_MATRIX`.
