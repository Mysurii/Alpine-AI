import ICustomization from './customization.type'
import IIntent from './intent.type'

interface IChatbot {
  _id: string
  name: string
  trained: boolean
  customization: ICustomization
  intents: IIntent[]
  usage: Array<ChatbotUsage>

  amountTrained: number
}

type ChatbotUsage = {
  date: string
  value: number
}

export default IChatbot
