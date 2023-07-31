export enum Sender {
  BOT,
  SELF,
}

export interface IMessage {
  text: string
  type: string
  sender: Sender
}
