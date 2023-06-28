import { BsArrowRightShort } from "react-icons/bs"
import Input from "../../components/ui/Input"
import Button from "../../components/ui/buttons/Button"
import { Link, useNavigate } from "react-router-dom"
import { useMutation } from "@tanstack/react-query"
import { createUser } from "../../services/auth"
import { AxiosError } from "axios"
import { ApiErrorResponse } from "../../types/apiresponse.type"
import toast from "react-hot-toast"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from '@hookform/resolvers/zod'
import { signUpValueSchema } from "../../validations/auth"


const Register = () => {
  const { control, handleSubmit, formState: { errors } } = useForm( {
    resolver: zodResolver( signUpValueSchema )
  } );

  const navigate = useNavigate()

  const mutation = useMutation( {
    mutationFn: createUser,
    onSuccess: () => {
      toast.success( "Succesfully registered." )
      navigate( '/signin' )
    },
    onError: ( error: AxiosError<ApiErrorResponse> ) => {
      toast.error( error.message )
    }
  } )

  const onSubmit = handleSubmit( data => {
    console.log( data.email )
    const { email, password, name } = data
    mutation.mutate( { email, password, name } )
  } );

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
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          {errors.root?.message}
          <Controller
            name="name"
            control={control}
            render={( { field } ) => <Input {...field} error={errors[ 'name' ]} />}
          />
          <Controller
            name="email"
            control={control}
            render={( { field } ) => <Input {...field} error={errors[ 'email' ]} type="email" />}
          />
          <Controller
            name="password"
            control={control}
            render={( { field } ) => <Input {...field} error={errors[ 'password' ]} type="password" />}
          />
          <Controller
            name="confirmPassword"
            control={control}
            render={( { field } ) => <Input {...field} error={errors[ 'confirmPassword' ]} type="password" />}
          />

        </form>
        <Button className="mt-8 w-min mx-auto" rightIcon={BsArrowRightShort} onClick={onSubmit}>Register</Button>
      </div>

    </div>
  )
}

export default Register
