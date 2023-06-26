import clsxm from "../../lib/clsxm"
import { IMessage } from "../../types/message.type"

interface IProps {
  message: IMessage
}

function Bubble ( { message }: IProps ) {
  const isBot = message.sender === 'bot'
  return (
    <div className={clsxm( "flex flex-col mt-3", [
      !isBot && 'items-end'
    ] )}>
      <div className={clsxm( 'flex min-w-[75px] w-fit p-2 rounded-lg', [
        isBot && 'text-left rounded-bl-none bg-gray-400 text-white',
        !isBot && 'text-right rounded-br-none bg-indigo-500 text-white'
      ] )}>{message.text}</div>
      <span className="text-neutral-300 text-sm">
        {message.date.toLocaleTimeString( [], { hour: '2-digit', minute: '2-digit' } )}
      </span>
    </div>
  )
}

export default Bubble