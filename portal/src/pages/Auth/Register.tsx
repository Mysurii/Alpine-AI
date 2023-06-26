import { BsArrowRightShort } from "react-icons/bs"
import Input from "../../components/ui/Input"
import Button from "../../components/ui/buttons/Button"
import { Link } from "react-router-dom"

const Register = () => {
  return (
    <div className="flex flex-col-reverse lg:flex-row h-screen overflow-hidden">
      <div className="w-full grid place-items-center lg:w-2/3 p-12 lg:p-0 lg:h-screen bg-indigo-900 text-white">
        <div className="grid place-items-center gap-8 text-center">
          <h2 className="text-3xl font-bold font-display">Already have an account?</h2>
          <Link to="/signin">
            <Button className="bg-indigo-900">Sign In</Button>

          </Link>
        </div>
      </div>

      <div className="h-screen w-full lg:w-1/3 flex flex-col justify-center max-w-lg mx-auto text-center p-12">
        <h1 className="text-3xl font-bold font-display my-8">Sign up</h1>
        <p className="text-lg my-2">Create a free account</p>
        <form className="flex flex-col gap-4">
          <Input label="name" name="name" type="text" error="Dit is een error" />
          <Input label="email" name="email" type="email" />
          <Input label="password" name="password" type="password" />
          <Input label="confirm password" name="confirm password" type="password" />
        </form>
        <Button className="mt-8 w-min mx-auto" rightIcon={BsArrowRightShort}>Register</Button>
      </div>

    </div>
  )
}

export default Register