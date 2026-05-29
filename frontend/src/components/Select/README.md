# Select

Custom styled dropdown/select component. Used by ReportModal.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `options` | `Array<{ value, label }>` | `[]` | Dropdown options |
| `value` | `string` | `''` | Currently selected value |
| `onChange` | `(value: string) => void` | — | Called with option value on selection |
| `placeholder` | `string` | `'Select an option'` | Shown when no value selected |
| `className` | `string` | `''` | Extra classes for the root element |

## Features

- Click-outside closes the dropdown automatically
- Chevron rotates on open (`rotate-180`)
- Selected option shown with checkmark
- Opens/closes on trigger button click
- Styled to match brand (`border-[#d1d5db]`, focus ring `#8c6a40`)

## Usage

```jsx
const options = [
  { value: 'inappropriate', label: 'Inappropriate content' },
  { value: 'spam',          label: 'Spam' },
]

<Select options={options} value={reason} onChange={setReason} placeholder="Select a reason" />
```
