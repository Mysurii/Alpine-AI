import { useEffect } from "react"
import Chatbot from "../../components/Chatbot"
import { useMessagesStore } from "../../stores/message.store"
import { IMessage } from "../../types/message.type"

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
  {
    text: 'Cool!',
    date: new Date(),
    sender: 'user'
  },
]

const sleep = ( ms: number ) => new Promise( ( r ) => setTimeout( r, ms ) );


const Example = () => {
  const { addMessage, emptyMessages } = useMessagesStore()

  useEffect( () => {
    const secondTimer = setInterval( async () => {
      for ( const msg of exampleMessages ) {
        await sleep( 500 )
        addMessage( msg )
      }
      await sleep( 2000 )
      emptyMessages()
    }, 4000 )
    return () => clearInterval( secondTimer )
  }, [] )
  return (
    <div className="h-screen flex items-center flex-col-reverse lg:flex-row justify-center p-2 lg:p-24 gap-28" id="example">
      <Chatbot />
      <div className="text-center lg:w-1/3 flex flex-col justify-center">
        <h2 className="text-3xl font-bold font-display">
          Let the chatbot do all the work
        </h2>
        <p className="mt-4 leading-relaxed text-gray-500 text-lg">Begin by customizing your chatbot to match your brand's personality and voice. Choose from a variety of templates and design options to create a chatbot that reflects your unique style and values.</p>
      </div>
    </div>
  )
}

export default Example