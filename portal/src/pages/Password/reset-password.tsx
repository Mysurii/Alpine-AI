import React from 'react'

import { Container, ForgotPasswordForm, FormGroup, Text, FormFields, FormButton } from './index.styles'
import { Wrapper } from '../Register/register.styles'
import { Title } from '../../components/global.styles'
import { LIGHT } from '../../constants/colors'
import { getURLQueries } from '../../utils/general'
import { TextField } from '@mui/material'
import { useJwt } from 'react-jwt'
import { isValidPassword } from '../../utils/validation'
import { changePassword } from '../../services/auth'
import { useNavigate } from 'react-router-dom'

const { accessToken, verificationCode } = getURLQueries(window.location.search)

function expiredAccessToken(token: string): boolean {
  const decoded = useJwt(token)
  return typeof token !== 'undefined' && (decoded.isExpired || decoded.decodedToken == null)
}

interface PasswordValidation {
  password: string | undefined
  isEmpty: boolean
  isStrong?: boolean
}

const ResetPassword: React.FC = (): JSX.Element => {
  const [newPassword, setNewPassword] = React.useState<PasswordValidation>()
  const [newConfirmPassword, setNewConfirmPassword] = React.useState<PasswordValidation>()
  const [apiResponse, setApiResponse] = React.useState<{ message: string; error: boolean } | undefined>()
  const navigate = useNavigate()

  const isTokenExpired = expiredAccessToken(accessToken)

  function isEmpty(str: string | undefined): boolean {
    return typeof str === 'undefined' || str === ''
  }

  function errorText(password: PasswordValidation | undefined, confirmPassword?: PasswordValidation | undefined): string | undefined {
    if (password?.isEmpty) {
      return 'Password required'
    }

    if (typeof password?.isStrong !== 'undefined' && !password.isStrong) {
      return 'Password not strong enough'
    }

    if (typeof confirmPassword !== 'undefined' && password?.password !== confirmPassword.password) {
      return 'Password and confirm password not the same'
    }
  }

  function validatePassword(password: string, setter: React.Dispatch<React.SetStateAction<PasswordValidation | undefined>>): void {
    const validation: PasswordValidation = {
      password,
      isEmpty: isEmpty(password),
      isStrong: isValidPassword(password),
    }

    setter(validation)
  }

  async function requestChangePassword(): Promise<void> {
    if (typeof newConfirmPassword?.password !== 'undefined') {
      localStorage.setItem('token', JSON.stringify({ accessToken }))
      const response = await changePassword(newConfirmPassword.password, verificationCode)

      const message: { message: string; error: boolean } = {
        message: '',
        error: false,
      }

      if (typeof response === 'string') {
        message.message = response
        message.error = true
      } else if (response) {
        // success
        message.message = 'Password successfully changed, redirecting to the login screen in 3 seconds'

        setTimeout(() => {
          navigate('/login')
        }, 3000)
      } else {
        // something went wrong
        message.error = true
        message.message = 'Something went wrong with changing the password'
      }

      setApiResponse(message)
    }
  }

  function resetPasswordForm(): JSX.Element {
    return (
      <FormFields>
        <FormGroup>
          <TextField
            type="password"
            label="New password"
            required={true}
            fullWidth
            helperText={errorText(newPassword, newConfirmPassword)}
            onChange={(event) => validatePassword(event.target.value, setNewPassword)}
            error={(newPassword?.isEmpty ?? !newPassword?.isStrong) || newConfirmPassword?.password !== newPassword?.password}
          />
        </FormGroup>

        <FormGroup>
          <TextField
            type="password"
            label="Confirm new password"
            required={true}
            fullWidth
            helperText={errorText(newConfirmPassword, newPassword)}
            onChange={(event) => validatePassword(event.target.value, setNewConfirmPassword)}
            error={(newConfirmPassword?.isEmpty ?? !newConfirmPassword?.isStrong) || newConfirmPassword.password !== newPassword?.password}
          />
        </FormGroup>

        <FormButton
          disabled={newPassword?.isEmpty ?? typeof errorText(newPassword, newConfirmPassword) === 'string'}
          onClick={() => {
            void requestChangePassword()
          }}
        >
          Change password
        </FormButton>
      </FormFields>
    )
  }

  return (
    <Wrapper flex center bgLight>
      <Container column justifyCenter alignCenter>
        <Title color={LIGHT}>Reset password</Title>

        <ForgotPasswordForm column justifyCenter alignCenter>
          {typeof apiResponse !== 'undefined' && <Text color={apiResponse.error ? 'red' : 'green'}>{apiResponse.message}</Text>}
          {isTokenExpired ? <Text color={'red'}>The password reset link is no longer valid.</Text> : resetPasswordForm()}
        </ForgotPasswordForm>
      </Container>
    </Wrapper>
  )
}

export default ResetPassword
