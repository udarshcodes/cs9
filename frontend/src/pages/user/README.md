# User Section (`pages/user/`)

Authenticated student dashboard. All routes here require login. Routes: `/dashboard`, `/raise-query`, `/profile`.

## Architecture

```
layout.jsx (shell)
├── DashboardHeader
├── LeftPane (collapsible)
├── <Outlet>  ← nested pages render here
└── Footer
```

## Layout (`layout.jsx`)

Owns shared state:
- `sidebarNav` — active left pane item
- `currentView` — current view label
- `notifications` / `unreadCount`
- `isLeftPaneCollapsed`
- `searchModalOpen`

Passes state to nested pages via `useOutletContext`.

## Routes

| URL | Page | File |
|-----|------|------|
| `/dashboard` | Student Dashboard | `pages/Dashboard/index.jsx` |
| `/raise-query` | Raise New Query | `pages/RaiseQuery/index.jsx` |
| `/profile` | Profile Settings | `pages/ProfileSettings/index.jsx` |

## Shared Service (`service.js`)

All pages import API functions from here:
- `fetchQuestions()` — list with search/filter/sort
- `fetchQuestionTags()` — distinct tags for category pane
- `voteQuestion()` — upvote toggle
- `fetchNotifications()` / `markAllNotifRead()`
- `fetchUserContributions()` — user's questions, answers, comments
- `normalizeQuestion()` — normalizes API question to component shape

## Constants (`constants.js`)

Shared static data:
- `STATUS_CONFIG` — status → color map
- `SEARCH_CATEGORIES` — search modal category grid
- `CONTRIBUTION_ITEMS` — contribution type metadata
- `FAQ_CATEGORIES` — right pane category list
