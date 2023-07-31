import ICustomization from './ICustomization'
import IIntent from './IIntent'

interface IChatbot {
  _id: string
  name: string
  description?: string
  customization: ICustomization
  intents: IIntent[]
  usage: Array<{ date: string; value: number }>
  amountTrained: number
}

export default IChatbot
