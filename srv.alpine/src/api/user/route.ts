import { Router } from 'express'
import userController from './user.controller'

const router = Router()

router.get(':id', userController.find)

export default router
