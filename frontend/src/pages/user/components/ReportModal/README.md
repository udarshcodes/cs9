# ReportModal (`pages/user/components/ReportModal/`)

Modal for reporting inappropriate question content.

## Usage

```jsx
<ReportModal
  open={isReportOpen}
  onClose={() => setIsReportOpen(false)}
  onSubmit={handleReportSubmit}
  submitting={isSubmitting}
/>
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `open` | `boolean` | Controls visibility |
| `onClose` | `function` | Called on Cancel or backdrop click |
| `onSubmit` | `function({ reason, description })` | Called on Send Report |
| `submitting` | `boolean` | Disables button while true |

## Components Used

- `Modal` (global) — `position="center"`
- `Select` (global) — reason dropdown
- `Button` (global) — Cancel + Send Report

## Design

- Reason dropdown + optional textarea + Cancel/Send Report buttons
- Submit button is `bg-red-600` to signal destructive action
- Currently a stub — `onSubmit` calls `notifyError("Report doesn't supported yet.")`
