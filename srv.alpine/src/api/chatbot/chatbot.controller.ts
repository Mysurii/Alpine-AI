import { RouteWrapper } from '@common/helpers/route-wrapper'
import ChatbotService from './chatbot.service'
import { Request, Response, NextFunction } from 'express'
import BadRequest from '@common/helpers/errors/badrequest'
import basicIntents from '@common/helpers/basic-intents.json'
import { INITIAL_CUSTOMIZATION } from './types/customization'

class ChatbotController {
  private chatbotService: ChatbotService

  constructor() {
    this.chatbotService = new ChatbotService()
  }

  chatbots = RouteWrapper(async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user

    if (!user) throw new BadRequest('User is not logged in!')

    const chatbots = await this.chatbotService.getChatbots(user._id)

    return res.json(chatbots)
  })

  createChatbot = RouteWrapper(async (req: Request, res: Response, next: NextFunction) => {
    const { name, description } = req.body
    const user = req.user

    if (!user) throw new BadRequest('User is not logged in!')

    if (!name) throw new BadRequest('Name of the chatbot is not provided.')

    const chatbot = {
      userId: user._id,
      name,
      description,
      intents: basicIntents,
      customization: INITIAL_CUSTOMIZATION,
      trained: false,
      usage: [],
      amountTrained: 0,
    }

    const created = await this.chatbotService.createChatbot(chatbot)

    if (!created) {
      throw new BadRequest('Could not create chatbot.')
    }

    return res.status(200).json({ data: created })
  })
}

export default new ChatbotController()
