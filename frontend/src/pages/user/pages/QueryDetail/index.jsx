import { useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams, useOutletContext, useLocation } from 'react-router-dom'
import {
  ArrowLeft, CheckCircle2, Check, CheckCircle, RotateCcw, ChevronUp, ChevronDown,
  AlertTriangle, MessageCircle, Loader, Pencil, Trash2,
} from 'lucide-react'
import ReportModal from '../../components/ReportModal/ReportModal'
import AnswerComments from '../../components/AnswerComments/AnswerComments'
import Button from '../../../../components/Button/Button'
import Modal from '../../../../components/Modal/Modal'
import {
  fetchQuestionDetail, fetchQuestions, postAnswer, voteAnswer, reportContent, postComment,
  resolveQuestion, acceptAnswer, unacceptAnswer, recordQuestionView, updateComment, deleteComment,
  updateAnswer, deleteAnswer,
} from '../../service'
import { notifySuccess, notifyError } from '../../../../lib/notify'
import { parseMarkdown } from '../../../../lib/markdown'
import DOMPurify from 'dompurify'

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '')

const STATUS_LABEL = {
  unanswered: 'Active',
  answered: 'In Progress',
  closed: 'Resolved',
}

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

function QueryDetailPage() {
  const { queryId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useOutletContext()
  const activeSidebarNav = location.state?.activeSidebarNav || ''

  const [data, setData] = useState(null)   // { question, answers, comments }
  const [loading, setLoading] = useState(true)
  const [reply, setReply] = useState('')
  const [posting, setPosting] = useState(false)
  const [resolving, setResolving] = useState(false)
  const [reportTarget, setReportTarget] = useState(null) // { type, id }
  const [reporting, setReporting] = useState(false)
  const [related, setRelated] = useState([])     // latest queries sharing tags
  const [replyTab, setReplyTab] = useState('write') // 'write' | 'preview'

  const load = useCallback(async () => {
    if (!queryId) return
    setLoading(true)
    try {
      const result = await fetchQuestionDetail(queryId)
      if (result.success) {
        setData(result.data)
      } else {
        notifyError(result.message)
      }
    } catch (error) {
      console.error(error)
      notifyError('Failed to load query detail')
    } finally {
      setLoading(false)
    }
  }, [queryId])

  useEffect(() => {
    load()
  }, [load])

  const handleReplyChange = (e) => {
    setReply(e.target.value)
  }

  const handlePostReply = async () => {
    if (posting) return
    setPosting(true)
    try {
      const result = await postAnswer(queryId, reply)
      if (result.success) {
        notifySuccess('Reply posted successfully')
        load()
        setReply('')
      } else {
        notifyError(result.message)
      }
    } catch (error) {
      console.error(error)
      notifyError('Failed to post reply')
    } finally {
      setPosting(false)
    }
  }

  const handleResolveQuery = async () => {
    if (resolving) return
    setResolving(true)
    try {
      const result = await resolveQuestion(queryId)
      if (result.success) {
        notifySuccess('Query resolved successfully')
        load()
      } else {
        notifyError(result.message)
      }
    } catch (error) {
      console.error(error)
      notifyError('Failed to resolve query')
    } finally {
      setResolving(false)
    }
  }

  const handleReport = async () => {
    if (reporting) return
    setReporting(true)
    try {
      const result = await reportContent(reportTarget.type, reportTarget.id)
      if (result.success) {
        notifySuccess('Report submitted successfully')
      } else {
        notifyError(result.message)
      }
    } catch (error) {
      console.error(error)
      notifyError('Failed to submit report')
    } finally {
      setReporting(false)
    }
  }

  const sanitizeHtml = (html) => {
    return DOMPurify.sanitize(html)
  }

  return (
    <div>
      {data && (
        <div>
          <h1>{data.question.title}</h1>
          <p dangerouslySetInnerHTML={{ __html: sanitizeHtml(parseMarkdown(data.question.content)) }} />
          {data.answers.map((answer) => (
            <div key={answer.id}>
              <h2>{answer.user.name}</h2>
              <p dangerouslySetInnerHTML={{ __html: sanitizeHtml(parseMarkdown(answer.content)) }} />
            </div>
          ))}
          <div>
            <input type="text" value={reply} onChange={handleReplyChange} />
            <button onClick={handlePostReply}>Post Reply</button>
          </div>
          <div>
            <button onClick={handleResolveQuery}>Resolve Query</button>
          </div>
          <div>
            <button onClick={handleReport}>Report</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default QueryDetailPage