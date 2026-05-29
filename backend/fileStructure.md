# Rogare Backend — File Structure

```
backend/
├── .env                         # Environment variables (PORT, MONGODB_URI, ALLOWED_ORIGINS)
├── .env.example                 # Sample env vars for reference
├── .gitignore
├── er_diagram.png               # Entity-relationship diagram
├── package-lock.json
├── package.json
└── src/
    ├── server.js                # Entry point — starts Express server
    ├── app.js                   # Express app setup — middleware, routes, Swagger
    ├── config/
    │   ├── db.js                # MongoDB connection
    │   ├── swagger.js           # Swagger spec builder
    │   ├── openapi-components.js
    │   └── openapi-paths.js
    ├── controllers/             # Route handlers (business logic)
    │   ├── admin.controller.js
    │   ├── answer.controller.js
    │   ├── auth.controller.js
    │   ├── comment.controller.js
    │   ├── flag.controller.js
    │   ├── moderation.controller.js
    │   ├── notification.controller.js
    │   ├── profile.controller.js
    │   ├── question.controller.js
    │   ├── resolver.controller.js
    │   ├── spark.controller.js
    │   └── user.controller.js
    ├── middleware/
    │   ├── authMiddleware.js     # JWT verification, role checking
    │   └── error.middleware.js  # Global error handler, 404 handler
    ├── models/                  # Mongoose schemas
    │   ├── answer.model.js
    │   ├── comment.model.js
    │   ├── flag.model.js
    │   ├── notification.model.js
    │   ├── question.model.js
    │   ├── role.model.js
    │   ├── spark-transaction.model.js
    │   ├── user.model.js
    │   ├── user-profile.model.js
    │   ├── user-role-mapper.model.js
    │   └── vote.model.js
    ├── routes/                 # Express routers (URL mapping)
    │   ├── admin.routes.js
    │   ├── answer.routes.js
    │   ├── auth.routes.js
    │   ├── comment.routes.js
    │   ├── flag.routes.js
    │   ├── leaderboard.routes.js
    │   ├── moderation.routes.js
    │   ├── notification.routes.js
    │   ├── profile.routes.js
    │   ├── question.routes.js
    │   ├── resolver.routes.js
    │   ├── spark.routes.js
    │   └── user.routes.js
    ├── services/               # Business logic layer
    │   ├── content.service.js
    │   ├── role.service.js
    │   └── spark.service.js
    ├── scripts/                # One-off scripts
    │   ├── ingest-faqs.js
    │   └── seed-admin.js
    └── utils/                 # Helpers
        ├── auth-token.js
        └── http.js
```

## Key Design Notes

- **Centralized question collection** — one `questions` collection serves both FAQ and Discussion surfaces, discriminated by `type: 'FAQ' | 'Discussion'`
- **FAQ rules** — `type: 'FAQ'` must have exactly 1 answer before `status: 'published'`
- **Discussion rules** — `type: 'Discussion'` follows normal Q&A: unanswered → answered → closed/removed
- **Roles** — USER, RESOLVER, ADMIN with many-to-many mapping via `UserRoleMapper`
- **Gamification** — Spark points system (ask +2, answer +5, accepted answer +15, daily login +1, etc.)
- **Moderation** — flag → review → action pipeline; soft-delete via `status: 'removed'`
