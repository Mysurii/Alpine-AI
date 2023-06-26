import { ImArrowRight } from 'react-icons/im';
import login from '../../assets/login.svg';
import configure from '../../assets/config.svg';
import copyImg from '../../assets/note.svg';
import successImg from '../../assets/celebrate.svg';

const Operation = () => {
  return (
    <div className='px-2 py-12 lg:py-48'>
      <h2 className='text-center text-3xl font-bold font-display '>Unleash the Power of Conversations: Create Your Custom Chatbot in Minutes!</h2>
      <div className=" flex flex-col lg:flex-row justify-evenly items-center gap-24 p-24" id="functionality">

        <div className="flex justify-center items-center flex-col text-center">
          <img src={login} width="400px" height="400px" />

          <p className="text-lg font-bold max-w-xs mt-8">Login</p>
        </div>
        <ImArrowRight className="text-4xl mt-12 lg:mt-0 rotate-90 lg:rotate-0" />
        <div className="flex justify-center items-center flex-col text-center">
          <img src={configure} width="400px" height="400px" />

          <p className="text-lg font-bold max-w-xs mt-8">Configure chatbot</p>
        </div>
        <ImArrowRight className="text-4xl mt-12 lg:mt-0 rotate-90 lg:rotate-0" />
        <div className="flex justify-center items-center flex-col text-center">
          <img src={copyImg} width="300px" height="400px" />

          <p className="text-lg font-bold max-w-xs mt-8">Copy & paste script</p>
        </div>
        <ImArrowRight className="text-4xl mt-12 lg:mt-0 rotate-90 lg:rotate-0" />
        <div className="flex justify-center items-center flex-col text-center">
          <img src={successImg} width="400px" height="400px" />

          <p className="text-lg font-bold max-w-xs mt-8">Let the chatbot do all the work!</p>
        </div>
      </div>
    </div>
  )
}

export default Operation;