import { ImArrowRight } from 'react-icons/im';
import login from '../../assets/login.svg';
import configure from '../../assets/config.svg';
import copyImg from '../../assets/note.svg';
import successImg from '../../assets/celebrate.svg';

const Operation = () => {
  return (
    <div className="w-screen flex flex-col lg:flex-row justify-evenly items-center gap-24 p-24" id="functionality">

      <div className="flex justify-center items-center flex-col text-center">
        <img src={login} width="400px" height="400px" />

        <p className="text-xl font-bold max-w-xs">Login</p>
      </div>
      <ImArrowRight className="text-4xl mt-12 lg:mt-0 rotate-90 lg:rotate-0" />
      <div className="flex justify-center items-center flex-col text-center">
        <img src={configure} width="400px" height="400px" />

        <p className="text-xl font-bold max-w-xs">Configure chatbot</p>
      </div>
      <ImArrowRight className="text-4xl mt-12 lg:mt-0 rotate-90 lg:rotate-0" />
      <div className="flex justify-center items-center flex-col text-center">
        <img src={copyImg} width="300px" height="400px" />

        <p className="text-xl font-bold max-w-xs">Copy and paste generated script</p>
      </div>
      <ImArrowRight className="text-4xl mt-12 lg:mt-0 rotate-90 lg:rotate-0" />
      <div className="flex justify-center items-center flex-col text-center">
        <img src={successImg} width="400px" height="400px" />

        <p className="text-xl font-bold max-w-xs">Let the chatbot do all the work!</p>
      </div>
    </div>
  )
}

export default Operation;