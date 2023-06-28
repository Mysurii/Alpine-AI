import { BsArrowRightShort } from "react-icons/bs"
import Input from "../../components/ui/Input"
import Button from "../../components/ui/buttons/Button"
import { Link, useNavigate } from "react-router-dom"
import { signInValueSchema } from "../../validations/auth"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from "react"
import useAuthStore from "../../stores/auth.store"
import { useMutation } from "@tanstack/react-query"
import { ILoginUser } from "../../types/user.type"
import toast from "react-hot-toast"

const Login = () => {

  const { control, handleSubmit, formState: { errors } } = useForm( {
    resolver: zodResolver( signInValueSchema )
  } );
  const [ errorMessage, setErrorMessage ] = useState<string>( '' )

  const authStore = useAuthStore()
  const navigate = useNavigate()

  const mutation = useMutation( {
    mutationFn: async ( loginState: ILoginUser ) => {
      await new Promise( ( resolve ) => setTimeout( resolve, 1000 ) )
      const user = await authStore.loginUser( loginState )
      console.log( user )
      if ( user === undefined || user === null ) {
        throw authStore.error ?? new Error( 'Something went wrong' )
      }
      return user
    },
    onSuccess: () => {
      toast.success( 'Successfully logged in.' )
      setErrorMessage( '' )
      authStore.setError( null )
      navigate( '/dashboard' )
    },
  } )

  const onSubmit = handleSubmit( data => {
    console.log( data )
    const { email, password } = data
    mutation.mutate( { email, password } )
  } );


  useEffect( () => {
    const error = authStore.error
    if ( error ) {
      if ( error.status === 401 || error.request.status === 404 ) {
        setErrorMessage( 'Invalid credentials' )
      } else if ( error.request.status === 400 ) {
        setErrorMessage( 'Invalid credentials' )
      } else if ( error.request.status === 500 ) {
        setErrorMessage( 'Something went wrong' )
      } else if ( error.request.status === 429 ) {
        setErrorMessage( 'Too many attempts, please try again later' )
      } else {
        setErrorMessage( error.message )
      }
    } else {
      setErrorMessage( '' )
    }
  }, [ authStore.error ] )



  return (
    <div className="flex flex-col-reverse lg:flex-row h-screen overflow-hidden">
      <div className="h-screen w-full lg:w-1/3 flex flex-col justify-center max-w-lg mx-auto text-center p-12">
        <h1 className="text-3xl font-bold font-display my-8">Sign in</h1>
        <form className="flex flex-col gap-4" >
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
        </form>
        {errorMessage && <small className="text-red-500">{errorMessage}</small>}
        <Button className="mt-8 mx-auto" rightIcon={BsArrowRightShort} onClick={onSubmit}>Sign In</Button>
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

