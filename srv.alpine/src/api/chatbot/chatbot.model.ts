import Account from '@api/auth/account.model'
import { Intent } from './types/intent'
import { Customization } from './types/customization'

export type Chatbot = {
  _id: Account['_id']
  name: string
  description?: string
  intents: Array<Intent>
  customization: Customization
  trained: boolean
  usage: Array<ChatbotUsage>
  amountTrained: number
  userId: Account['_id']
}

type ChatbotUsage = {
  date: string
  value: number
}
