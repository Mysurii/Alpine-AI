import { CircularProgress, FormLabel, TextField } from '@mui/material'
import Button from '../../components/ui/Button/RoundedButton'
import { DARKER, LIGHT } from '../../constants/colors'
import { AlpineIcon, Wrapper } from '../Register/register.styles'
import { Title } from '../../components/global.styles'
import React, { ChangeEvent, useEffect, useState } from 'react'
import { Form, LoginContainerBox, LoginContainer, SmallTextLink, SignUpContainer } from './login.styles'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { ILoginUser } from '../../types/IUser'
import useAuthStore from '../../stores/auth.store'
import { toast } from 'react-toastify'
import { isValidEmail } from '../../utils/validation'

const Login: React.FC = (): JSX.Element => {
  const [loginState, setLoginState] = useState<ILoginUser>({
    email: '',
    password: '',
  })
  const authStore = useAuthStore()
  const [errorMessage, setErrorMessage] = useState<string>('')

  useEffect(() => {
    const error = authStore.error
    if (error) {
      if (error.status === 401 || error.request.status === 404) {
        setErrorMessage('Invalid credentials')
      } else if (error.request.status === 400) {
        setErrorMessage('Invalid credentials')
      } else if (error.request.status === 500) {
        setErrorMessage('Something went wrong')
      } else if (error.request.status === 429) {
        setErrorMessage('Too many attempts, please try again later')
      } else {
        setErrorMessage(error.message)
      }
    } else {
      setErrorMessage('')
    }
  }, [authStore.error])

  const mutation = useMutation({
    mutationFn: async (loginState: ILoginUser) => {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      const user = await authStore.loginUser(loginState)
      console.log(user)
      if (user === undefined || user === null) {
        throw authStore.error ?? new Error('Something went wrong')
      }
      return user
    },
    onSuccess: () => {
      toast.success('Successfully logged in.')
      setErrorMessage('')
      authStore.setError(null)
      navigate('/')
    },
  })

  const navigate = useNavigate()

  const changeInput = (e: ChangeEvent<HTMLInputElement>): void => {
    setLoginState((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const isFieldEmpty = (state: typeof loginState): boolean => {
    return state.email === '' || state.password === ''
  }

  const login = (state: ILoginUser): void => {
    mutation.mutate(state)
  }

  const navigateForgotPassword = (): void => {
    console.log('testing')
    navigate('/forgot-password')
  }

  const disabledInputFields = isFieldEmpty(loginState) || mutation.isLoading

  const enterKeyListener = (event: React.KeyboardEvent<HTMLDivElement>): void => {
    if (event.key === 'Enter') {
      login(loginState)
    }
  }

  return (
    <Wrapper flex center bgLight>
      <LoginContainer column justifyCenter alignCenter>
        {mutation.isLoading ? (
          <CircularProgress color="secondary" />
        ) : (
          <>
            <Title color={LIGHT}>Login</Title>
            <LoginContainerBox>
              <Form>
                {errorMessage ? <FormLabel error={true}>{errorMessage}</FormLabel> : null}
                <TextField
                  helperText={loginState.email.length > 0 && !isValidEmail(loginState.email) && 'Please provide a valid email'}
                  error={loginState.email.length > 0 && !isValidEmail(loginState.email)}
                  label="email"
                  name="email"
                  placeholder="email"
                  fullWidth
                  onChange={changeInput}
                  onKeyDown={disabledInputFields ? undefined : enterKeyListener}
                />
                <TextField fullWidth placeholder="password" label="password" type="password" name="password" onChange={changeInput} onKeyDown={disabledInputFields ? undefined : enterKeyListener} />
                <SmallTextLink onClick={navigateForgotPassword}>forgot password?</SmallTextLink>
                <Button
                  disabled={disabledInputFields}
                  onClick={() => {
                    login(loginState)
                  }}
                >
                  Sign in
                </Button>
              </Form>
            </LoginContainerBox>
          </>
        )}
      </LoginContainer>
      <SignUpContainer column justifyCenter alignCenter>
        <AlpineIcon color={DARKER} />
        <Title color={DARKER}>No account yet?</Title>
        <Button onClick={() => navigate('/register')}>Sign up</Button>
      </SignUpContainer>
    </Wrapper>
  )
}

export default Login
