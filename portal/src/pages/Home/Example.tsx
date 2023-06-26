import Chatbot from "../../components/Chatbot"

const Example = () => {
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