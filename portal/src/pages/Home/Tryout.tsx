import { AiOutlineRight } from "react-icons/ai"
import Button from "../../components/ui/buttons/Button"

function Tryout () {
  return (
    <div
      className="h-screen flex flex-col gap-4 justify-center items-center bg-indigo-900 text-neutral-300 text-center">

      <h2 className="text-4xl font-bold font-display">Experience the Future of Conversations</h2>
      <p className="text-xl max-w-lg mt-4">"Try Out Alpine Today and Transform Your Website's Engagement. Customize, Preview, and Deploy Your AI Chatbot in Minutes!"</p>
      <Button className='mt-12 bg-' >Try now !</Button>
    </div>
  )
}

export default Tryout