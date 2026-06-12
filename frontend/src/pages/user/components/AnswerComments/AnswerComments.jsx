import { useState } from 'react'
import { CornerDownRight, MessageSquare, Pencil, Trash2, AlertTriangle } from 'lucide-react'
import { parseMarkdown } from '../../../../lib/markdown'
import Modal from '../../../../components/Modal/Modal'
import Button from '../../../../components/Button/Button'
import DOMPurify from 'dompurify'

function initialsOf(name = '') {
  return name.trim().split(/\s+/).map(n => n[0]).slice(0, 2).join('').toUpperCase() || 'U'
}

function fmtDate(d) {
  if (!d) return ''
  const date = new Date(d)
  if (Number.isNaN(date.getTime())) return ''

  // Format the time part in 24-hour IST format (HH:MM)
  const timePart = date.toLocaleTimeString('en-IN', {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  })

  // Get date parts in Asia/Kolkata timezone to compare days correctly
  const formatter = new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric'
  })
  const parts = formatter.formatToParts(date)
  const partMap = Object.fromEntries(parts.map(p => [p.type, p.value]))
  
  const targetYear = parseInt(partMap.year, 10)
  const targetMonth = parseInt(partMap.month, 10) - 1 // 0-indexed
  const targetDay = parseInt(partMap.day, 10)

  // Get current date parts in Asia/Kolkata timezone
  const now = new Date()
  const nowParts = formatter.formatToParts(now)
  const nowPartMap = Object.fromEntries(nowParts.map(p => [p.type, p.value]))
  const nowYear = parseInt(nowPartMap.year, 10)
  const nowMonth = parseInt(nowPartMap.month, 10) - 1
  const nowDay = parseInt(nowPartMap.day, 10)

  // Create clean Date objects representing just the calendar days in IST
  const targetDateIST = new Date(targetYear, targetMonth, targetDay)
  const nowDateIST = new Date(nowYear, nowMonth, nowDay)

  const diffTime = nowDateIST.getTime() - targetDateIST.getTime()
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24))

  // Format month and day
  const dateOptions = { timeZone: 'Asia/Kolkata', day: 'numeric', month: 'short' }
  if (targetYear !== nowYear) {
    dateOptions.year = 'numeric'
  }
  const datePart = date.toLocaleDateString('en-IN', dateOptions)

  if (diffDays === 0) {
    return `Today at ${timePart}`
  } else if (diffDays === 1) {
    return `Yesterday at ${timePart}`
  } else {
    return `${datePart} at ${timePart}`
  }
}

/**
 * Threaded comments under a single answer.
 *  - comments: all Comment docs for this answer (depth 0 = top-level, depth 1 = reply)
 *  - onSubmit(answerId, body, parentId)
 *
 * NOTE: render helpers below are plain functions returning JSX (not nested
 * components) so the reply <textarea> keeps focus across keystrokes.
 */
function AnswerComments({ answerId, comments = [], currentUserId, locked = false, onSubmit, onEdit, onDelete }) {
  const [replyTo, setReplyTo] = useState(null)   // parentId being replied to, or 'root'
  const [value, setValue]     = useState('')
  const [busy, setBusy]       = useState(false)

  const [editingCommentId, setEditingCommentId] = useState(null)
  const [editText, setEditText] = useState('')
  const [editBusy, setEditBusy] = useState(false)

  const [commentToDelete, setCommentToDelete] = useState(null)
  const [deleteBusy, setDeleteBusy] = useState(false)

  // Captured once on mount; the 15-min edit window is generous and the backend
  // enforces the real limit, so we avoid calling Date.now() during render.
  const [mountedAt] = useState(() => Date.now())

  const topLevel = comments.filter(c => !c.parent_id)
  const repliesOf = id => comments.filter(c => c.parent_id === id)

  // Nothing to show: resolved question with no existing comments on this answer
  if (locked && comments.length === 0) return null

  const isEditable = (c) => {
    if (c.author_id !== currentUserId) return false
    if (c.is_deleted || c.moderation_state !== 'visible') return false
    const createdTime = new Date(c.created_at).getTime()
    const diffMs = mountedAt - createdTime
    return diffMs < 900000 // 15 minutes
  }

  const sanitizeHtml = (html) => {
    return DOMPurify.sanitize(html)
  }

  const renderComment = (comment) => {
    const sanitizedHtml = sanitizeHtml(parseMarkdown(comment.body))
    return (
      <div dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />
    )
  }

  return (
    <div>
      {topLevel.map((comment) => (
        <div key={comment.id}>
          {renderComment(comment)}
          {repliesOf(comment.id).map((reply) => (
            <div key={reply.id}>
              {renderComment(reply)}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

export default AnswerComments