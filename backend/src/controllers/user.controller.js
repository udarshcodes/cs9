import Answer from '../models/answer.model.js'
import Comment from '../models/comment.model.js'
import Notification from '../models/notification.model.js'
import Question from '../models/question.model.js'
import Role from '../models/role.model.js'
import UserProfile from '../models/user-profile.model.js'
import UserRoleMapper from '../models/user-role-mapper.model.js'
import User from '../models/user.model.js'
import { getUserRoles, normalizeRoleName } from '../services/role.service.js'
import {
  createHttpError,
  escapeRegex,
  getPagination,
  paginationResult,
} from '../utils/http.js'

function publicUser(user, roles, includeEmail = false, profile = null) {
  const value = {
    id: user.user_id,
    name: profile?.display_name || user.name,
    roles,
    avatarUrl: profile?.avatar_url || '',
    sparkPoints: user.spark_points || 0,
    createdAt: user.created_at,
  }

  if (includeEmail) {
    value.email = user.email
    value.status = user.status || 'active'
  }

  return value
}

function publicProfile(profile, canViewPrivate) {
  if (!profile || canViewPrivate) {
    return profile || {}
  }

  return {
    displayName: profile.display_name,
    bio: profile.bio,
    avatarUrl: profile.avatar_url,
    expertise: profile.expertise || [],
    reputation: profile.reputation || 0,
  }
}

const regexPattern = /^[\w\s\-\.]{1,50}$/i

export async function listUsers(req, res, next) {
  try {
    const { page, limit, skip } = getPagination(req.query)
    const filter = {}
    const role = req.query.role ? normalizeRoleName(req.query.role) : null

    if (req.query.role && !role) {
      throw createHttpError(400, 'Invalid role')
    }

    if (req.query.status) {
      filter.status = req.query.status
    }

    if (typeof req.query.search === 'string' && req.query.search.trim()) {
      const search = req.query.search.trim()
      if (!regexPattern.test(search)) {
        throw createHttpError(400, 'Invalid search query')
      }
      const regex = new RegExp(escapeRegex(search), 'i')
      filter.$or = [{ name: regex }, { email: regex }]
    }

    if (role) {
      const roleDocument = await Role.findOne({ name: role.toLowerCase() }).lean()
      const mappings = roleDocument
        ? await UserRoleMapper.find({ role_id: roleDocument.role_id }).select('user_id').lean()
        : []
      const userIds = mappings.map((mapping) => mapping.user_id)

      filter.user_id = { $in: userIds }
    }

    const [users, total] = await Promise.all([
      User.find(filter).sort({ created_at: -1 }).skip(skip).limit(limit),
      User.countDocuments(filter),
    ])
    const profiles = await UserProfile.find({
      user_id: { $in: users.map((user) => user.user_id) },
    }).lean()
    const profileByUserId = Object.fromEntries(
      profiles.map((profile) => [profile.user_id, profile]),
    )

    const result = await Promise.all(
      users.map(async (user) =>
        publicUser(user, await getUserRoles(user), true, profileByUserId[user.user_id]),
      ),
    )

    res.json({
      success: true,
      users: result,
      pagination: paginationResult(page, limit, total),
    })
  } catch (error) {
    next(error)
  }
}

export async function getUserById(req, res, next) {
  try {
    const user = await User.findOne({ user_id: req.params.userId })

    if (!user) {
      throw createHttpError(404, 'User not found')
    }

    const [roles, profile, questionsCount, answersCount, acceptedAnswersCount] =
      await Promise.all([
        getUserRoles(user),
        UserProfile.findOne({ user_id: user.user_id }).lean(),
        Question.countDocuments({ author_id: user.user_id }),
        Answer.countDocuments({ author_id: user.user_id }),
        Answer.countDocuments({
          author_id: user.user_id,
          is_accepted: true,
          is_deleted: { $ne: true },
        }),
      ])

    const canViewEmail =
      req.user.userId === user.user_id || req.user.roles.includes('ADMIN')

    res.json({
      success: true,
      user: {
        ...publicUser(user, roles, canViewEmail, profile),
        profile: publicProfile(profile, canViewEmail),
        stats: { questionsCount, answersCount, acceptedAnswersCount },
      },
    })
  } catch (error) {
    next(error)
  }
}