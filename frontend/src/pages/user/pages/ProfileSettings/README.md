# ProfileSettings (`pages/user/pages/ProfileSettings/`)

User profile editing page at `/profile`.

## Features

- Edit display name → syncs to `User.name` in backend + updates `useAuthStore`
- Change password → `PUT /api/auth/change-password`
- View spark balance and activity

## Data Flow

```
fetchProfile() → displayName → form state
                        ↓
         updateProfile({ displayName }) → PATCH /api/profile/me
                        ↓
         setUser({ ...current, name: fresh.displayName })  ← via getState()
```

## Auth Store Sync

On display name update, `setUser()` is called with `useAuthStore.getState().user` (not closure) to avoid stale state. The backend also syncs `displayName` to `User.name`.

## Route

Protected — requires authentication.
