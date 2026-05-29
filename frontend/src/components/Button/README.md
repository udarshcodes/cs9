# Button

Reusable button component with two variants — `primary` (filled dark) and `secondary` (outlined).

## Variants

- **primary** — Black filled button, white text. For main CTAs.
- **secondary** — White with border, dark text. For secondary actions.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'primary'` \| `'secondary'` | `'primary'` | Visual style |
| `type` | `string` | `'button'` | HTML button type |
| `className` | `string` | `''` | Additional Tailwind classes |
| `children` | `ReactNode` | — | Button label/content |

All standard `<button>` attributes are forwarded via spread props.
