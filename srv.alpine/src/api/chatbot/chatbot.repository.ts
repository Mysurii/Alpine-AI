import { BaseRepository } from '@common/db/BaseRepository'
import { Chatbot } from './chatbot.model'
export default class ChatbotRepository extends BaseRepository<Chatbot> {
  getChatbotsOfUser = async (userId: string): Promise<Chatbot[]> => {
    return await this.collection.find<Chatbot>({ userId }).toArray()
  }

  incrementChatbotUsage = async (userId: string, chatbotId: string) => {
    const bot = await this.findOne(chatbotId)

    if (!bot) return

    const currentDate = new Date().toISOString().split('T')[0]
    let incremented = false

    const usage =
      bot.usage?.map((us) => {
        if (us.date === currentDate) {
          us.value++
          incremented = true
        }
        return us
      }) ?? []

    if (!incremented) {
      usage.push({ date: currentDate, value: 1 })
    }

    bot.usage = usage

    try {
      await this.update(bot._id, bot)
    } catch {}
  }

  getCollectionName(): string {
    return 'chatbot'
  }
}
