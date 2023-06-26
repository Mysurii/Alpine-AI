export type Sender = 'user' | 'bot'

export interface IMessage {
  text: string
  date: Date
  sender: Sender
}