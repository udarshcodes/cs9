import { useCallback, useEffect, useState } from 'react'
import {
  ArrowLeft, Tag, Pin, Lock, CheckCircle, Zap, ChevronUp, MessageSquare,
  User, Clock, Loader, ShieldCheck, VenetianMask, Eye, Award, Trash2, AlertTriangle, Send, RotateCcw,
} from 'lucide-react'
import { fetchQuestionDetail, unacceptAnswer } from '../../../user/service'
import { adminResolveQuery, adminSeekApproval, adminMarkApprovalReceived, exportToFAQ, fetchTags, fetchUsers } from '../../service'
import { notifyError, notifySuccess } from '../../../../lib/notify'
import useAuthStore from '../../../../store/useAuthStore'
import { parseMarkdown } from '../../../../lib/markdown'
import DOMPurify from 'dompurify'
import Modal from '../../../../components/Modal/Modal'

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '')

const STATUS_STYLE = {
  unanswered: 'bg-amber-50 text-amber-700',
  answered:   'bg-blue-50 text-blue-700',
  closed:     'bg-gray-100 text-gray-600',
  removed:    'bg-red-50 text-red-700',
  draft:      'bg-gray-100 text-gray-600',
  published:  'bg-emerald-50 text-emerald-700',
  archived:   'bg-gray-100 text-gray-500',
}

function initialsOf(name = '') {
  const regex = /^\s+|\s+$/g;
  const trimmedName = name.replace(regex, '');
  return trimmedName.trim().split(/\s+/).map(n => n[0]).slice(0, 2).join('').toUpperCase() || 'U'
}

function formatDateTime(value) {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'

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

function Badge({ className, children }) {
  return <span className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase ${className}`}>{children}</span>
}

// Real moderation state from the raw fields (admin always receives bodies, so we
// derive the flag ourselves rather than trusting the redaction helper).
function modState(doc) {
  if (doc.is_deleted) return 'deleted'
  if (doc.moderation_status && doc.moderation_status !== 'approved') return 'under_review'
  return 'visible'
}

function AnswerCard({ answer, comments, questionStatus, onUnaccept }) {
  const score = (answer.upvotes ?? 0) - (answer.downvotes ?? 0)
  const state = modState(answer)
  const canUnaccept = answer.is_accepted && questionStatus !== 'closed'
  const sanitizedAnswer = DOMPurify.sanitize(parseMarkdown(answer.body))

  return (
    <div className="p-4 bg-white rounded shadow">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center">
          <span className="text-gray-600 text-sm">{answer.author.name}</span>
          <span className="ml-2 text-gray-400 text-xs">{formatDateTime(answer.created_at)}</span>
        </div>
        <div className="flex items-center">
          <span className="text-gray-600 text-sm">{score}</span>
          <span className="ml-2 text-gray-400 text-xs">score</span>
        </div>
      </div>
      <div className="mb-4" dangerouslySetInnerHTML={{ __html: sanitizedAnswer }} />
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          {canUnaccept && (
            <button
              className="text-gray-600 hover:text-gray-900 transition duration-200 ease-in-out"
              onClick={onUnaccept}
            >
              Unaccept
            </button>
          )}
        </div>
        <div className="flex items-center">
          <span className="text-gray-600 text-sm">{state}</span>
        </div>
      </div>
    </div>
  )
}

export default AnswerCard