# Modal

Generic modal overlay component with two positioning modes.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isOpen` | `boolean` | — | Controls visibility |
| `onClose` | `function` | — | Called on backdrop click, Escape key, or X button |
| `position` | `'center'` \| `'top-right'` | `'center'` | Anchors modal to top-right or centers it |
| `title` | `string` | `'Dialog'` | Accessible title for the dialog |
| `panelClassName` | `string` | `''` | Extra classes for the modal panel |
| `children` | `ReactNode` | — | Modal content |

## Position Modes

### `position="center"` (default)
- Fixed overlay covering the full viewport
- Modal centered with `bg-black/10` backdrop
- Scroll lock on `document.body` when open
- Escape key closes

### `position="top-right"`
- Fixed, anchored to `top-20 right-6`
- No body scroll lock (used for dropdown-style panels like LoginModal)
- Escape key closes
- No backdrop click to close

## Accessibility

- `aria-modal="true"`, `role="dialog"`, `aria-label` from `title`
- Escape key handler attached when open
- Focus trapping not yet implemented
