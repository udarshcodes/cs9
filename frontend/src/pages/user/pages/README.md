# User Pages (`pages/user/pages/`)

Nested page views rendered inside `UserLayout` via `react-router-dom`'s `<Outlet>`.

## Pages

| Folder | Route | Description |
|--------|-------|-------------|
| `Dashboard/` | `/dashboard` | Main student dashboard, SPA with tabs + question list |
| `RaiseQuery/` | `/raise-query` | Form to submit a new discussion question |
| `QueryDetail/` | `/dashboard/query/:id` | Full question thread (stub, not routed) |
| `ProfileSettings/` | `/profile` | Edit display name, change password |

## Layout Integration

All pages receive shared state via `useOutletContext()` from `pages/user/layout.jsx`:

```js
const {
  user,                  // current user object
  sidebarNav,           // 'Dashboard' | 'My Queries'
  setSidebarNav,        // control left pane nav
  currentView,          // active view label
  searchModalOpen,      // search modal visibility
  setSearchModalOpen,   // toggle search modal
  openSearchModal,      // convenience: setSearchModalOpen(true)
} = useOutletContext()
```

## Navigation

All navigation is **SPA** — no URL changes for tab switching or opening question details. The URL only changes via explicit navigation with `navigate()`.

## Missing READMEs

Each page folder has its own `README.md` — see:
- `Dashboard/README.md`
- `RaiseQuery/README.md`
- `QueryDetail/README.md`
- `ProfileSettings/README.md`
