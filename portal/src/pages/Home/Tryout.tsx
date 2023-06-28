import { BsArrowRightShort } from "react-icons/bs"
import Button from "../../components/ui/buttons/Button"
import { Link } from "react-router-dom"

function Tryout () {
  return (
    <div
      className="h-screen flex flex-col gap-4 justify-center items-center bg-black text-neutral-300 text-center">

      <h2 className="text-4xl font-bold font-display">Experience the Future of Conversations</h2>
      <p className="text-xl max-w-lg mt-4">"Try Out Alpine Today and Transform Your Website's Engagement. Customize, Preview, and Deploy Your AI Chatbot in Minutes!"</p>
      <Link to="/signup">
        <Button className='mt-12 bg-black' rightIcon={BsArrowRightShort} rounded>Try now</Button>
      </Link>
    </div>
  )
}

export default Tryout