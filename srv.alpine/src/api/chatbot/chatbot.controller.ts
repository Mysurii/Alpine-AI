import { RouteWrapper } from '@common/helpers/route-wrapper'
import ChatbotService from './chatbot.service'
import { Request, Response, NextFunction } from 'express'
import BadRequest from '@common/helpers/errors/badrequest'
import basicIntents from '@common/helpers/basic-intents.json'
import { INITIAL_CUSTOMIZATION } from './types/customization'
import NotFound from '@common/helpers/errors/notFound'

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

  specific = RouteWrapper(async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user
    const { id } = req.params

    if (!user) throw new BadRequest('User is not logged in!')

    const chatbot = await this.chatbotService.getChatbotById(id)

    if (!chatbot) throw new NotFound('Chatbot not found')

    return res.json(chatbot)
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

  updateSpecific = RouteWrapper(async (req: Request, res: Response, next: NextFunction) => {
    const { name, description, intents, customization } = req.body
    const { id } = req.params

    const user = req.user

    if (!user) throw new BadRequest('User is not logged in!')

    const chatbot = {
      _id: id,
      userId: user._id,
      name,
      description,
      intents: basicIntents,
      customization: INITIAL_CUSTOMIZATION,
      trained: false,
      usage: [],
      amountTrained: 0,
    }

    const updated = await this.chatbotService.update(id, chatbot)

    res.status(204).json()
  })

  delete = RouteWrapper(async (req: Request, res: Response, next: NextFunction) => {
    const { name, description, intents, customization } = req.body
    const { _id } = req.params

    const user = req.user

    if (!user) throw new BadRequest('User is not logged in!')

    const deleted = await this.chatbotService.delete(_id, user._id)

    if (!deleted) throw new BadRequest('Could not delete the chatbot')

    return res.status(204).json()
  })

  chatbotResponse = RouteWrapper(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params

    const chatbot = await this.chatbotService.getChatbotById(id)

    if (!chatbot) throw new NotFound('Chatbot not found.')

    await this.chatbotService.incrementUsage(id)

    return res.status(200).json({})
  })
}

export default new ChatbotController()
