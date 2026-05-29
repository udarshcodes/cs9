# LoginModal (`pages/landing/LoginModal/`)

Login form modal shown on the landing page.

## Usage

```jsx
<LoginModal
  isOpen={isLoginModalOpen}
  onClose={() => setIsLoginModalOpen(false)}
  onLogin={(user) => { setCurrentUser(user); navigate('/dashboard') }}
/>
```

## Features

- **Position** — `position="top-right"` (fixed right side, under header button)
- **Form** — email + password fields using global `Input` component
- **Forgot password** — separate "Reset Password" view with email input
- **Error** — red inline error message for invalid credentials
- **Submit** — `authLogin()` → `POST /api/auth/login` → calls `onLogin(user)` on success

## Props

| Prop | Type | Description |
|------|------|-------------|
| `isOpen` | `boolean` | Controls visibility |
| `onClose` | `function` | Resets state and closes modal |
| `onLogin` | `function(user)` | Called with user object on successful login |

## Reset State

On close, `resetState()` clears: `error`, `isForgotPassword`, `userId`, `password`.

## Auth Flow

```
authLogin(email, password)
        ↓
POST /api/auth/login → sets HttpOnly cookie + returns user
        ↓
onLogin(user) → parent sets currentUser → navigate('/dashboard')
```
