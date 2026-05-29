# SearchModal (`pages/user/components/SearchModal/`)

Search modal for the student dashboard. Triggered by the search button in `DashboardHeader` (via layout context).

## Usage

Consumed in `DashboardPage` via `searchModalOpen` state from layout context. Not a standalone component — renders inline within `Dashboard/index.jsx`.

## Props (via context)

| Prop | Source | Description |
|------|--------|-------------|
| `searchModalOpen` | layout context | Controls visibility |
| `setSearchModalOpen` | layout context | Toggle modal |
| `openSearchModal` | layout context | Sets `searchModalOpen(true)` |

## Features

- **Text search** — `Enter` or "Search" button → sets `searchQuery` → triggers `loadQuestions()`
- **Multi-select categories** — click category cards to toggle; selected shown as chips with ×
- **Combined query** — text + category names concatenated as search terms
- **Loading state** — spinner while questions are loading

## Data Flow

```
submitSearch(text + selectedCategories)
        ↓
setSearchQuery(combined)
        ↓
useEffect([searchQuery]) → loadQuestions({ search })
        ↓
fetchQuestions({ search }) → API
```

## Access

Opened via `openSearchModal()` in layout context. `DashboardHeader`'s search button triggers it. The modal itself is rendered in `DashboardPage` via `{searchModalOpen && <SearchModal ...>}`.
