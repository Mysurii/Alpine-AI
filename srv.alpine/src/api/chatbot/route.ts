import { Router } from 'express'
import chatbotController from './chatbot.controller'

const router = Router()

router.get('/me', chatbotController.chatbots)
router.post('/create', chatbotController.createChatbot)
router.put('/:id', chatbotController.createChatbot)
router.delete('/:id', chatbotController.createChatbot)

export default router
