import { useMessagesStore } from "../../stores/message.store"
import Bubble from "./Bubble"

function MessagesList () {
  const { messages } = useMessagesStore()

  return (
    <div className="h-[500px] bg-white p-4">
      {messages.map( message => <Bubble message={message} /> )}
    </div>
  )
}

export default MessagesList