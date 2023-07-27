import type { Account } from './authentication'
import type { PartialBy } from '../util/types-util'
import type { Customization } from './customization'

export type Chatbot = {
  _id: Account['_id']
  name: string
  description?: string
  createdAt: number // date
  intents: Array<Intent>
  customization: Customization
  trained: boolean,
  usage: Array<ChatbotUsage>,
  amountTrained: number,
  encryptionKey?: string
}

type ChatbotUsage = {
  date: string,
  value: number
}

export type ChatBotKeys = Partial<Record<keyof Chatbot, string | number>>

export type CreateChatbot = Pick<Chatbot, 'name' | 'description'> & Pick<PartialBy<Chatbot, 'intents' | 'customization'>, 'intents' | 'customization'>

export type Intent = {
  tag: string
  patterns: string[]
  responses: [
    [
      {
        type: string
        text: string
        tag?: string
      }
    ]
  ]
  followUpQuestions: string[]
}

export type ChatbotResponse = {
  response: string | Array<{ text: string; type: 'text' }>
}
