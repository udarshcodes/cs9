# Rogare Frontend — File Structure

```
frontend/
├── .gitignore
├── README.md
├── context.md                  # Local convention notes for frontend work
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
├── vite.config.js
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── App.jsx                 # Root component with router
│   ├── main.jsx                # Entry point
│   ├── index.css              # Global styles
│   ├── api/
│   │   ├── README.md
│   │   └── axios.jsx          # Axios instance with interceptors
│   ├── assets/
│   │   ├── hero.png
│   │   ├── lab-support.png
│   │   ├── react.svg
│   │   └── vite.svg
│   ├── components/            # Shared/reusable components (folder-per-component)
│   │   ├── Button/
│   │   │   ├── Button.tsx
│   │   │   └── README.md
│   │   ├── Footer/
│   │   │   ├── Footer.tsx
│   │   │   └── README.md
│   │   └── Modal/
│   │       └── Modal.tsx
│   ├── pages/
│   │   ├── landing/            # Public landing page
│   │   │   ├── index.jsx
│   │   │   ├── service.jsx
│   │   │   ├── components/
│   │   │   │   └── FaqCard.jsx
│   │   │   └── LoginModal/
│   │   │       ├── index.jsx
│   │   │       └── service.jsx
│   │   ├── user/              # Authenticated user dashboard
│   │   │   └── index.jsx
│   │   └── admin/             # Admin dashboard
│   │       └── index.jsx
│   ├── routes/
│   │   ├── index.jsx          # Route definitions
│   │   └── ProtectedRoute.jsx # Auth guard component
│   └── store/
│       └── useAuthStore.js    # Zustand auth state store
```

## Conventions

- **Folder-per-component** — each component lives in its own folder; direct file import (no `index.tsx` barrel for single-component folders)
- **Pages** — feature pages grouped under `pages/`, with co-located services/hooks/constants
- **State** — Zustand for global auth state; component-level state for local UI
- **API calls** — services colocated with their page; shared axios config in `src/api/`
- **Tailwind CSS** — utility-first styling (Tailwind v4)
- **Routing** — React Router v7; `ProtectedRoute` wraps authenticated routes
