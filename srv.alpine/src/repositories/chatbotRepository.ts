import DatabaseRepository from './abstracts/databaseRepository'
import { COLLECTIONS } from './collections'
import type { Account } from '../models/authentication'
import type { Chatbot, CreateChatbot } from '../models/chatbot'
import type { UpdateFilter, Document } from 'mongodb'
import type { $MatchFindOption, MongoExtendedFind } from 'mongodb-helper'

const chatBotProjection: Partial<Record<keyof Chatbot, 1>> = {
  _id: 1,
  name: 1,
  description: 1,
  intents: 1,
  customization: 1,
  createdAt: 1,
  amountTrained: 1,
  usage: 1,
  trained: 1
}

export default class ChatBotRepository extends DatabaseRepository {
  private async filterChatbots(userid: Account['_id'], match?: $MatchFindOption, projection: Record<string, 1 | 0> = chatBotProjection): Promise<Array<Chatbot>> {
    const aggregation: MongoExtendedFind = [
      {
        $match: { _id: this.parseId(userid) }, // match the user id
      },
      {
        $project: {
          _id: 0,
          chatbots: 1,
        },
      },
      {
        $unwind: {
          // split each array element out into their own Document
          path: '$chatbots',
          preserveNullAndEmptyArrays: false,
        },
      },
      {
        // removes the 'chatbots: {  }' wrapper
        $replaceRoot: {
          newRoot: '$chatbots',
        },
      },
    ]

    if (typeof match !== 'undefined') {
      // match the chatbot filters
      aggregation.push({
        $match: match,
      })
    }

    aggregation.push({
      $project: projection,
    })

    const items = await (await this.aggregate(aggregation)).toArray()

    return items as Array<Chatbot>
  }

  updateChatbotById(userid: Account['_id'], chatbotid: Chatbot['_id'], updateFilter: UpdateFilter<Document> | Partial<Document>) {
    const filter = {
      _id: this.parseId(userid),
      'chatbots._id': this.parseId(chatbotid),
    }

    return this.updateDocument(filter, updateFilter)
  }

  async getChatbots(userid: Account['_id'], filter: $MatchFindOption = {}, projection: Record<string, 1 | 0> = chatBotProjection) {
    const response = await this.filterChatbots(userid, filter, projection)

    let chatbots: Array<Chatbot> = []

    if (typeof response !== 'undefined' && response instanceof Array) {
      chatbots = response
    }

    return chatbots
  }

  async getChatbotById(userid: Account['_id'], chatbotId: Chatbot['_id'], projection: Record<string, 1 | 0> = chatBotProjection) {
    const match = {
      _id: this.parseId(chatbotId),
    }

    return (await this.filterChatbots(userid, match, projection))[0]
  }

  async incrementChatbotUsage(userid: Account['_id'], chatbotId: Chatbot['_id']) {
    const bot = await this.getChatbotById(userid, chatbotId, { usage: 1 }) as Pick<Chatbot, 'usage'>

    const currentDate = new Date().toISOString().split('T')[0]

    let incremented = false

    const usage = bot.usage?.map(us => {
      if (us.date === currentDate) {
        us.value++
        incremented = true
      }
      return us
    }) ?? []

    if (!incremented) {
      usage.push({ date: currentDate, value: 1 })
    }

    const updateFilter = { $set: { 'chatbots.$.usage': usage } }

    return this.updateChatbotById(userid, chatbotId, updateFilter)
  }

  async createChatbot(userid: Account['_id'], toCreateChatbot: CreateChatbot) {
    const updateFilter: UpdateFilter<Document> | Partial<Document> = {
      $push: {
        chatbots: toCreateChatbot,
      },
    }

    return this.updateDocumentById(userid, updateFilter)
  }

  deleteChatbotById(userid: Account['_id'], chatbotId: Chatbot['_id']) {
    const updateFilter = { $pull: { chatbots: { _id: this.parseId(chatbotId) } } }

    return this.updateDocumentById(userid, updateFilter)
  }

  updateChatbot(userid: Account['_id'], chatbot: Chatbot) {
    const updateFilter = { $set: { 'chatbots.$': chatbot } }

    return this.updateChatbotById(userid, chatbot._id, updateFilter)
  }

  updateChatbotTrainedStatus(userid: Account['_id'], chatbotId: Chatbot['_id'], trained: boolean) {
    const updateFilter = { $set: { 'chatbots.$.trained': trained }, $inc: { 'chatbots.$.amountTrained': 1 }}

    return this.updateChatbotById(userid, chatbotId, updateFilter)
  }

  updateEncryptionKey(userid: Account['_id'], chatbotId: Chatbot['_id'], encryptedKey: string) {
    const updateFilter = { $set: { 'chatbots.$.encryptionKey': encryptedKey } }

    return this.updateChatbotById(userid, chatbotId, updateFilter)
  }

  protected getCollectionName(): string {
    return COLLECTIONS.USERS
  }
}
