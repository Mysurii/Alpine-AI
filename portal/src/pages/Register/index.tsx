import React, { ChangeEvent, useState } from 'react'
import { CircularProgress, TextField } from '@mui/material'
import Button from '../../components/ui/Button/RoundedButton'
import { DARKER, LIGHT, PRIMARY } from '../../constants/colors'
import { AlpineIcon, ErrorMessage, Form, RegisterContainer, SignInContainer, SmallLink, Wrapper } from './register.styles'
import { Title } from '../../components/global.styles'
import { isValidEmail, isValidPassword } from '../../utils/validation'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../../stores/auth.store'
import { ICreateUser } from 'types/IUser'
import Dialog from '../../components/ui/Dialog'
import { StyledTextField } from '../Home/home.styles'
import { toast } from 'react-toastify'
import { useMutation } from '@tanstack/react-query'
import { createUser } from '../../services/auth'
import { AxiosError } from 'axios'
import { ApiErrorResponse } from 'types/ApiResponses'

const Register: React.FC = (): JSX.Element => {
  const [state, setState] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [error, setError] = useState<string>('')
  const [open, setOpen] = useState<boolean>(false)
  const [verificationCode, setVerificationCode] = useState<string>('')

  const navigate = useNavigate()
  const authStore = useAuthStore()

  const isFormValid = isValidEmail(state.email) && isValidPassword(state.password) && state.password === state.confirmPassword && state.name.length >= 3

  const mutation = useMutation({
    mutationFn: async (loginState: ICreateUser) => {
      return await new Promise((resolve) => {
        setTimeout(() => {
          resolve(createUser(loginState))
        }, 1000)
      })
    },
    onSuccess: (data, variables, context) => {
      setOpen(true)
      setError('')
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      if (typeof error === 'string') {
        setError(error)
      } else if (error.response?.data.message) {
        setError(error.response.data.message)
      } else {
        setError('Something went wrong')
      }
    },
  })

  const changeInput = (e: ChangeEvent<HTMLInputElement>): void => {
    setState((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const register = (e: any): void => {
    e.preventDefault()
    const { name, email, password } = state

    // if fields are not valid, do nothing
    if (!isFormValid) return
    mutation.mutate({ name, email, password })
  }

  const onSubmit = async (): Promise<void> => {
    if (verificationCode === '') return
    const isSuccess = await authStore.verifyUser(verificationCode)
    if (isSuccess) {
      toast.success('Successfully registered')
      navigate('/login')
      return
    }
    toast.error('Something went wrong. Is the code valid?')
  }

  return (
    <Wrapper flex center bgLight>
      <SignInContainer column justifyCenter alignCenter>
        <AlpineIcon />
        <Title color={LIGHT}>Already have an account?</Title>
        <Button primary={LIGHT} secondary={PRIMARY} onClick={() => navigate('/login')}>
          Sign in
        </Button>
      </SignInContainer>
      <RegisterContainer column justifyCenter alignCenter>
        {mutation.isLoading ? (
          <CircularProgress color="primary" />
        ) : (
          <>
            <Title color={DARKER}>Sign up</Title>
            {error && <ErrorMessage>{error}</ErrorMessage>}
            <Form onSubmit={register}>
              <TextField
                label="name"
                name="name"
                placeholder="name"
                fullWidth
                error={state.name.length < 3}
                helperText={state.name.length < 3 && 'Please provide a valid name'}
                onChange={changeInput}
              />
              <TextField
                label="email"
                placeholder="email"
                name="email"
                fullWidth
                error={state.email.length > 0 && !isValidEmail(state.email)}
                helperText={state.email.length > 0 && !isValidEmail(state.email) && 'Please provide a valid email!'}
                onChange={changeInput}
              />
              <TextField
                label="password"
                name="password"
                type="password"
                placeholder="password"
                fullWidth
                error={state.password.length > 0 && !isValidPassword(state.password)}
                helperText={state.password.length > 0 && !isValidPassword(state.password) && 'Password should have a length of 8 characters with lowercase, uppercase and special characters!'}
                onChange={changeInput}
              />
              <TextField
                label="confirm password"
                name="confirmPassword"
                type="password"
                placeholder="confirm password"
                fullWidth
                error={state.confirmPassword.length > 0 && state.password !== state.confirmPassword}
                helperText={state.confirmPassword.length > 0 && state.password !== state.confirmPassword && 'Password and confirmpassword should be the same!'}
                onChange={changeInput}
              />
              <SmallLink>Already have an account? Sign in</SmallLink>
              <Button type="submit" disabled={!isFormValid}>
                Sign up
              </Button>
            </Form>
            <Dialog
              title="Confirm register"
              description="There is a email send to you, please add.. "
              isOpen={open}
              onClose={() => setOpen(false)}
              onSubmit={() => {
                void onSubmit()
              }}
            >
              <StyledTextField
                label="verification code"
                id="code"
                type="text"
                value={verificationCode}
                placeholder="verification code"
                onChange={(e) => setVerificationCode(e.target.value)}
                error={verificationCode === ''}
                helperText="Please provide the verifcation code"
                fullWidth
              />
            </Dialog>
          </>
        )}
      </RegisterContainer>
    </Wrapper>
  )
}

export default Register
