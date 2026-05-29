# RaiseQuery (`pages/user/pages/RaiseQuery/`)

Form page for students to submit a new discussion question.

## Current State

Stub page — renders a placeholder UI. Needs full form implementation:
- Title, body (rich text editor), category, tags
- Optional spark bounty (reserve sparks on submission)
- Submit → `POST /api/questions` → redirect to dashboard

## Route

Protected — requires authentication. Unauthenticated users are redirected to `/`.
