import { BASIC_INTENTS } from '../helpers/basicIntents'
import type { Chatbot } from 'models/Chatbot'
import BaseRepository from './base.repository'
import { INITIAL_CUSTOMIZATION } from '../models/Customization'
import type { ID } from '../models/BaseEntity'

export default class ChatbotRepository extends BaseRepository<Chatbot> {
  constructor() {
    super('chatbot')
  }

  protected getCollectionName(): string {
    return 'users'
  }

  async findByUser(userId: ID): Promise<Chatbot | null> {
    const user = await this.collection.findOne<Chatbot>({ userId })
    return user
  }

  async createBasicChatbot(userId: ID): Promise<boolean> {
    const chatbot: Partial<Chatbot> = {
      name: 'Bottie',
      createdAt: new Date(),
      trained: false,
      customization: INITIAL_CUSTOMIZATION,
      intents: BASIC_INTENTS,
      usage: [],
      userId,
    }
    return await this.insert(chatbot)
  }
}
