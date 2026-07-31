# Frontend Architecture

## Component Hierarchy & Directory Organization
- `src/app`: Application entry point, global routes (`AppRoutes.tsx`), store setup.
- `src/features`: Domain-driven feature modules (`admin`, `hr`, `team-lead`, `team-manager`, `employee`, `analytics`).
- `src/security`: RBAC policies (`permissionMatrix.ts`), guards (`RoleGuard.tsx`), permissions and role definitions.
- `src/shared`: Reusable design-system components, common types, layout wrappers, and global utilities.
- `src/design-system`: Theme providers, tokens, and style utilities.
