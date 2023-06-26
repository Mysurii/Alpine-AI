import { BsArrowRightShort } from "react-icons/bs"
import Input from "../../components/ui/Input"
import Button from "../../components/ui/buttons/Button"
import { Link } from "react-router-dom"

const Login = () => {
  return (
    <div className="flex flex-col-reverse lg:flex-row h-screen overflow-hidden">
      <div className="h-screen w-full lg:w-1/3 flex flex-col justify-center max-w-lg mx-auto text-center p-12">
        <h1 className="text-3xl font-bold font-display my-8">Sign in</h1>
        <form className="flex flex-col gap-4">
          <Input label="email" name="email" type="email" />
          <Input label="password" name="password" type="password" />
        </form>
        <Button className="mt-8 mx-auto" rightIcon={BsArrowRightShort}>Sign In</Button>
      </div>
      <div className="w-full grid place-items-center lg:w-2/3 p-12 lg:p-0 lg:h-screen bg-indigo-900 text-white">
        <div className="grid place-items-center gap-8 text-center">
          <h2 className="text-3xl font-bold font-display">New to Alpine?</h2>
          <Link to="/signup">
            <Button className="bg-indigo-900">Sign up</Button>

          </Link>
        </div>
      </div>
    </div>
  )
}

export default Login