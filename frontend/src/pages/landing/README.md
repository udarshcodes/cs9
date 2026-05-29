# Landing Page (`pages/landing/`)

Public page at `/` — shown when not logged in. Displays hero, FAQ accordion, and CTAs.

## Files

| File | Description |
|------|-------------|
| `index.jsx` | Main landing page — hero, FAQ accordion, stats, footer |
| `service.jsx` | API calls — `getFaqSections()`, `getCurrentUser()` |
| `LoginModal/` | Login modal (top-right position) |
| `components/FaqCard.jsx` | Single FAQ accordion row with answer toggle |

## Data Flow

```
getFaqSections() → useQuery(['landing-faqs'])
                      ↓
              faqSections (array)
                      ↓
              sections state → Accordion UI
```

## Key Features

- **FAQ Accordion** — expandable per-category, one open at a time (keyboard accessible)
- **Login Modal** — top-right anchored, shown when clicking "Login" or CTA buttons
- **TanStack Query** — FAQs cached with `staleTime: Infinity` (static content)
- **Dark mode** — CSS filter invert on `:root`
- **Page scroll progress** — tracks scroll position for sticky nav fade-out

## Routing

This page is the `/` route — public, no auth required. If `currentUser` exists, header "Login" button navigates to `/dashboard` instead.

## Context

- Reads `isLoginModalOpen` / `setIsLoginModalOpen` from parent scope
- `currentUser` from `useAuthStore()` for conditional rendering
