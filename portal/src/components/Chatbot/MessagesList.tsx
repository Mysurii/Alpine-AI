import Bubble from "./Bubble"

function MessagesList () {

  return (
    <div className="h-[50vh] bg-white p-4">
      <Bubble text="Hello world!" date={new Date()} isBot />
      <Bubble text="Hey, how are you?" date={new Date()} isBot={false} />
    </div>
  )
}

export default MessagesList