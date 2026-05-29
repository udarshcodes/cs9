# Dashboard (`pages/user/pages/Dashboard/`)

Main student dashboard. SPA — tabs, question cards, and inline question detail all render here without URL changes.

## State

| State | Source | Description |
|-------|--------|-------------|
| `queries` | `fetchQuestions()` | Current question list |
| `searchQuery` | `submitSearch()` | Active search string |
| `activeTab` | local `useState` | `'All Queries'` \| `'Trending'` \| `'Recent'` \| `'Unanswered'` \| `'Closed'` |
| `sidebarNav` | from layout context | Controls whether "My Queries" mode is active |
| `selectedCategories` | local | Tags selected in search modal for filtering |
| `selectedQueryId` | local | Currently viewed inline detail (null = list view) |
| `contributions` | `fetchUserContributions()` | Top 3 from API, reversed |

## Tabs (hidden in "My Queries")

| Tab | Filter |
|-----|--------|
| All Queries | no filter |
| Trending | `upvotes > 0` |
| Recent | `createdAfter: 24hrs ago` |
| Unanswered | `status: Active \| In Progress` |
| Closed | `status: Closed` |

## SPA Navigation

- Clicking a question card → `handleCardClick(id)` → fetches detail inline, shows "← Back to all queries"
- Clicking a contribution → same inline detail
- No URL changes, no React Router navigation

## Search Modal

Opened via `openSearchModal()` from layout context. Submitting search sets `searchQuery` which triggers `loadQuestions()` via `useEffect`.

## Right Pane

- **Top FAQ Categories** — tag filter, multi-select, updates `searchQuery` on click
- **Your Contribution** — top 3 real contributions from `GET /api/users/:userId/contributions?limit=3`
