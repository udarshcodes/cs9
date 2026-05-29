# QueryDetail (`pages/user/pages/QueryDetail/`)

Full question detail page with answers and comments. Currently a stub.

## Planned Features

- Fetch question by `questionId` from URL param
- Display question body with `dangerouslySetInnerHTML`
- List answers with vote buttons
- Threaded comments on answers (up to 2 levels: `depth: 0` and `depth: 1`)
- Reply to answer → `POST /api/answers/:id/comments`
- Accept answer (if question author)
- Submit new answer

## Route

Uses `useParams()` to get `questionId` from `/dashboard/query/:id`.

## Note

This page is not routed — no route currently maps to it in `routes/index.jsx`. The dashboard currently handles inline question detail via `selectedQueryId` state instead of navigation.
