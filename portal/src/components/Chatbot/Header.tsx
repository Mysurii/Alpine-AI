
import { IoClose } from 'react-icons/io5'

function Header () {
  return (
    <div className="flex justify-between p-4 rounded-t-lg bg-indigo-500 text-white">
      <h3>Alpine</h3>
      <IoClose className="text-xl transition duration-150 hover:scale-90 cursor-pointer" />
    </div>
  )
}

export default Header