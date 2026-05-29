# Frontend Context

This frontend should follow a Vite + React structure like the reference tree shared by the user. Treat this file as the local convention note for future frontend work.

## Target Shape

```text
frontend/
├── .cursor/rules/
├── .github/
├── .husky/
├── public/
│   ├── carousel/
│   └── static images and icons
├── src/
│   ├── api/
│   ├── assets/
│   ├── cachingClient/
│   ├── components/
│   ├── context/
│   ├── pages/
│   ├── routes.jsx
│   ├── services/
│   └── utils/
├── tests/
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.js
```

## Source Organization

- Keep shared API clients in `src/api/`, for example `axios.ts`.
- Keep reusable UI in `src/components/`.
- Keep app-wide providers and state containers in `src/context/`.
- Keep page-level features in `src/pages/`, grouped by domain or route.
- Keep cross-page service modules in `src/services/`.
- Keep generic formatting and data helpers in `src/utils/`.
- Keep static imported images in `src/assets/`; keep directly served public files in `public/`.

## Component Pattern

Reusable components should use a folder per component:

```text
src/components/Button/
├── Button.tsx
└── README.md
```

Use the component file for implementation (e.g. `Button.tsx`, `Footer.tsx`) and `README.md` for usage notes when the component is shared or non-trivial. Do NOT use `index.tsx` barrel exports for single-component folders — they add indirection with no benefit.

## Feature/Page Pattern

Feature pages should be organized by capability:

```text
src/pages/Home/ForecastBuilding/
├── components/
├── constants/
├── hooks/
├── services/
├── utils/
└── index.jsx
```

Keep feature-specific forms, tables, modals, hooks, constants, and services inside that feature folder. Promote code to `src/components/`, `src/services/`, or `src/utils/` only when it is reused across multiple features.

## Conventions

- Prefer feature-based organization over broad type-only folders for page logic.
- Use direct file imports for single-component folders. Keep barrel exports for folders with multiple named exports only.
- Keep network calls and persistence logic out of React components; place them in `services/`.
- Keep route definitions centralized in `src/routes.jsx`.
- Mixed `.jsx`, `.tsx`, `.js`, and `.ts` files are acceptable, matching the reference structure.
- Use Tailwind CSS for styling unless an existing local component style requires a different pattern.
- Add focused tests under `tests/` for important workflows and reusable logic.
