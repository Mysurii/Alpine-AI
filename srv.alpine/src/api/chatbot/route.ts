import { Router } from 'express'
import chatbotController from './chatbot.controller'

const router = Router()

router.post('/create', chatbotController.createChatbot)
router.get('/me', chatbotController.chatbots)

export default router
