# store/

## useAuthStore.js

Zustand store for authentication state. Persisted to `localStorage` key `rogare-auth`.

### State

| Field | Type | Description |
|-------|------|-------------|
| `user` | `object \| null` | Current user object (name, email, role, userId) |
| `setUser(user)` | `function` | Sets user and persists to localStorage |
| `clearUser()` | `function` | Clears user and removes from localStorage |

### Auth Store Shape

```js
{
  user: {
    userId: '...',    // backend user_id
    name: 'Priya Mehta',
    email: 'priya.mehta@gmail.com',
    role: 'USER',     // 'USER' | 'RESOLVER' | 'ADMIN'
    spark_points: 42,
  }
}
```

### Usage

```js
import useAuthStore from '../../store/useAuthStore'

const { user, setUser, clearUser } = useAuthStore()
```

The persisted `localStorage` key is `rogare-auth`. On page load, Zustand rehydrates the user from localStorage automatically.
