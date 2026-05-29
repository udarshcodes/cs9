# Admin Dashboard (`pages/admin/`)

Admin-only page at `/admin`. Route is protected by `ProtectedRoute(requiredRole='ADMIN')`.

## Current State

This page is a stub — the actual admin dashboard is rendered at `src/pages/admin/index.jsx`. Most admin functionality (user management, FAQ publishing, moderation) is still implemented as server-rendered pages or direct API calls.

## Route Protection

```jsx
<ProtectedRoute requiredRole="ADMIN" path="/admin" element={<AdminPage />} />
```

The `ProtectedRoute` middleware checks:
1. User is authenticated (has valid JWT)
2. User role is `ADMIN`

If unauthenticated → redirect to `/`. If wrong role → redirect to `/dashboard`.

## Notes

- Admin navigation lives in the shared `UserLayout` when `currentUser.role === 'ADMIN'`
- Admin sidebar uses the same `LeftPane` + `DashboardHeader` as the student dashboard
- For future work: split admin into a separate layout with its own navigation
