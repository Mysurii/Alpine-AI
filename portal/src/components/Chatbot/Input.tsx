import { AiOutlineSend } from 'react-icons/ai'

function Input () {
  return (
    <div className="h-14 border-t w-full flex justify-around items-center bg-white rounded-b-lg">
      <input className='border-none outline-0 h-[80%] w-[60%] block' placeholder='type..' />
      <AiOutlineSend className="text-2xl cursor-pointer text-neutral-500 transition duration-150 hover:text-indigo-500" />
    </div>
  )
}

export default Input