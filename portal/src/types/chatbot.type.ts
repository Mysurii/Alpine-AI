import ICustomization from './customization.type'
import IIntent from './intent.type'

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
