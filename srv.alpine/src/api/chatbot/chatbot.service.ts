import BadRequest from '@common/helpers/errors/badrequest'
import { Chatbot } from './chatbot.model'
import ChatbotRepository from './chatbot.repository'
import NotFound from '@common/helpers/errors/notFound'

export default class ChatbotService {
  private chatbotRepository: ChatbotRepository

  constructor() {
    this.chatbotRepository = new ChatbotRepository()
  }

  createChatbot = async (chatbot: Omit<Chatbot, '_id'>): Promise<Chatbot> => {
    return await this.chatbotRepository.create(chatbot)
  }

  getChatbots = async (userId: string) => {
    return await this.chatbotRepository.getChatbotsOfUser(userId)
  }

  getChatbotById = async (id: string) => {
    return await this.chatbotRepository.findOne(id)
  }

  update = async (id: string, chatbot: Partial<Chatbot>) => {
    return await this.chatbotRepository.update(id, chatbot)
  }
  delete = async (chatbotId: string, userId: string): Promise<boolean> => {
    const chatbot = await this.chatbotRepository.findOne(chatbotId)
    if (!chatbot) throw new NotFound('Chatbot does not exist')

    if (chatbot.userId !== userId) throw new BadRequest('Invalid rights.')

    return await this.chatbotRepository.delete(chatbotId)
  }

  incrementUsage = async (id: string) => {
    const chatbot = await this.getChatbotById(id)

    if (!chatbot) throw new NotFound('Chatbot not found.')

    return await this.chatbotRepository.incrementChatbotUsage(id)
  }
}
