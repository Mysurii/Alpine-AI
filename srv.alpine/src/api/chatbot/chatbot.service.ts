import { Chatbot } from './chatbot.model'
import ChatbotRepository from './chatbot.repository'

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

  incrementUsage = async () => {
    await this.incrementUsage()
  }
}
