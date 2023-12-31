import Header from "./Header"
import Input from "./Input"
import MessagesList from "./MessagesList"

function Chatbot () {
  return (
    <div className="h-[620px] w-[375px] border border-neutral-400 rounded-lg">
      <Header />
      <MessagesList />
      <Input />
    </div>
  )
}

export default Chatbot