import Answer from '../models/answer.model.js'
import Comment from '../models/comment.model.js'
import Notification from '../models/notification.model.js'
import Question from '../models/question.model.js'
import FAQQuestion from '../models/faq.model.js'
import { QuestionView } from '../models/question_view.model.js'

import User from '../models/user.model.js'
import UserProfile from '../models/user-profile.model.js'
import { randomUUID } from 'node:crypto'
import Vote from '../models/vote.model.js'
import { publishDomainEvent } from '../services/domain-events.service.js'
import { awardSpark, reserveBounty } from '../services/spark.service.js'
import {
  createHttpError,
  escapeRegex,
  getPagination,
  paginationResult,
} from '../utils/http.js'

const tagRegex = /^([a-z0-9]+(-[a-z0-9]+)*)$/i;

function slugifyTag(tag) {
  if (!tagRegex.test(tag)) {
    throw new Error('Invalid tag');
  }
  return String(tag)
    .trim()
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'general'
}

function normalizeTags(tags) {
  const cleanedTags = Array.isArray(tags)
    ? tags.map((tag) => String(tag).trim()).filter(Boolean)
    : (typeof tags === 'string' ? [tags.trim()].filter(Boolean) : [])

  return cleanedTags.length > 0 ? cleanedTags : ['General']
}

const ALLOWED_ATTACHMENT_TYPES = new Set(['application/pdf', 'image/png', 'image/jpeg'])
const MAX_ATTACHMENT_SIZE = 5 * 1024 * 1024
// Attachments are stored as binary embedded in the Question document. MongoDB
// caps a single document at 16MB, so the combined attachment payload must stay
// safely under that, leaving headroom for the rest of the document.
const MAX_TOTAL_ATTACHMENTS_SIZE = 12 * 1024 * 1024

function sanitizeAttachmentsForResponse(attachments = [], questionId) {
  return (attachments || []).map((attachment) => ({
    attachment_id: attachment.attachment_id,
    file_name: attachment.file_name,
    mime_type: attachment.mime_type,
    download_url: `/api/questions/${questionId}/attachments/${attachment.attachment_id}`,
  }))
}

const GENERIC_FAQ_TAGS = new Set(['faq', 'internship', 'vins'])

function getFaqTags(faq) {
  const tags = normalizeTags(faq.tags)
  return tags.filter((tag) => !GENERIC_FAQ_TAGS.has(tag.toLowerCase()))
}

async function getDisplayNameByUserId(userIds) {
  const ids = [...new Set(userIds.filter(Boolean))]

  if (!ids.length) {
    return {}
  }

  const [users, profiles] = await Promise.all([
    User.find({ user_id: { $in: ids } }).select('user_id name').lean(),
    UserProfile.find({ user_id: { $in: ids } }).select('user_id display_name').lean(),
  ])
  const displayNameById = Object.fromEntries(users.map((u) => [u.user_id, u.name]))

  for (const profile of profiles) {
    if (profile.display_name) {
      displayNameById[profile.user_id] = profile.display_name
    }
  }

  return displayNameById
}

export async function listPublishedFAQs(req, res, next) {
  try {
    const faqs = await FAQQuestion.find({
      kind: 'faq',
      status: 'published',
      visibility: 'public',
    })
      .sort({ is_pinned: -1, title: 1 })
      .lean()

    const groupedByTag = new Map()

    for (const faq of faqs) {
      const tags = getFaqTags(faq)
      const item = {
        id: faq.question_id,
        question: faq.title,
        answer: faq.body,
        tags,
        updatedAt: faq.updated_at,
      }

      for (const tag of tags) {
        const tagId = slugifyTag(tag)

        if (!groupedByTag.has(tagId)) {
          groupedByTag.set(tagId, {
            id: tagId,
            label: tag,
            faqs: [],
          })
        }

        groupedByTag.get(tagId).faqs.push(item)
      }
    }

    const tags = Array.from(groupedByTag.values())
    const grouped = {}
    for (const tag of tags) {
      grouped[tag.label] = tag.faqs
    }

    res.render('faqs', { success: true, tags, faqs: grouped, total: faqs.length })
  } catch (error) {
    next(error)
  }
}

function isAdmin(req) {
  return req.user && req.user.role === 'admin'
}