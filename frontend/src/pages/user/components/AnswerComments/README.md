# AnswerComments (`pages/user/components/AnswerComments/`)

Renders threaded comments on an answer.

## Usage

Used inside `QueryDetail` or inline answer view. Displays:
- Top-level comments (`depth: 0`)
- Replies to comments (`depth: 1`, indented)
- Reply button on each comment → opens inline reply form

## Props

| Prop | Type | Description |
|------|------|-------------|
| `answerId` | `string` | Answer this comment section belongs to |
| `comments` | `array` | Array of comment objects from API |

## Thread Structure

```js
{
  depth: 0,          // top-level comment
  reply_count: 2,    // number of replies
  // replies are separate documents with parent_id → comment_id
}
{
  depth: 1,          // reply
  parent_id: '...',  // points to root comment
  root_comment_id: '...'
}
```

## Notes

- `root_comment_id` chains entire thread — all replies in a thread share the same root
- Max depth is 2 (no replies to replies)
- Reply form appears inline below the parent comment
- Currently a single-file component, not fully integrated into any page
