import { Router } from 'express'
import authController from './auth.controller'

const router = Router()

router.post('/signup', authController.register)
router.post('/signin', authController.login)

export default router
