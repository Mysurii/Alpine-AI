import { create } from "zustand";
import { IMessage } from "../types/message.type";

interface MessageState {
  messages: IMessage[]
  addMessage: ( message: IMessage ) => void,
  emptyMessages: () => void
  startExample: () => void
}

const exampleMessages: IMessage[] = [
  {
    text: 'Hello, I am the virtual assistant of Alpine. How can I help you?',
    date: new Date(),
    sender: 'bot'
  },
  {
    text: 'What can I do on this website?',
    date: new Date(),
    sender: 'user'
  },
  {
    text: 'Customize your very own chatbot. Like me!',
    date: new Date(),
    sender: 'bot'
  },
]

export const useMessagesStore = create<MessageState>( ( set, get ) => ( {
  messages: [],
  addMessage: ( message: IMessage ) => {
    set( state => ( {
      ...state,
      messages: [ ...state.messages, message ]
    } ) )
  },
  emptyMessages: () => {
    set( state => ( {
      ...state,
      messages: []
    } ) )
  },
  startExample: () => {
    for ( ; ; ) {
      for ( const msg of exampleMessages ) {
        setInterval( () => {
          get().addMessage( msg )
        }, 500 )
      }
      get().emptyMessages()
    }
  }
} ) )