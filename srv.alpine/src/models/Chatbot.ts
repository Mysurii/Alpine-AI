import type { Customization } from './Customization'
import type { BaseEntity } from './BaseEntity'
import type { Intent } from './Intent'

export type Chatbot = BaseEntity & {
  name: string
  createdAt: Date
  trained: boolean
  Customization: Customization
  intents: Array<Intent>
  usage: Array<ChatbotUsage>
}

type ChatbotUsage = {
  date: string
  value: number
}
