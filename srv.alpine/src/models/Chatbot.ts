import type { Customization } from './Customization'
import type { BaseEntity, ID } from './BaseEntity'
import type { Intent } from './Intent'

export type Chatbot = BaseEntity & {
  name: string
  createdAt: Date
  trained: boolean
  customization: Customization
  intents: Array<Intent>
  usage: Array<ChatbotUsage>
  userId: ID
}

type ChatbotUsage = {
  date: string
  value: number
}
