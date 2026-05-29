import { Router } from 'express'
import {
  changeMyPassword,
  getMyProfile,
  getPublicProfile,
  updateMyProfile,
} from '../controllers/profile.controller.js'
import { checkRole, verifyToken } from '../middleware/authMiddleware.js'

const router = Router()

router.use(verifyToken, checkRole('USER', 'RESOLVER', 'ADMIN'))
router.get('/me', getMyProfile)
router.patch('/me', updateMyProfile)
router.patch('/password', changeMyPassword)
router.get('/:userId', getPublicProfile)

export default router
