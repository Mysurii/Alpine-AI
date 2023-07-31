import React from 'react'
import { Container, ForgotPasswordForm, Text, FormButton } from './index.styles'
import { TextField } from '@mui/material'
import { Wrapper } from '../Register/register.styles'
import { Title } from '../../components/global.styles'
import { LIGHT } from '../../constants/colors'
import { isValidEmail } from '../../utils/validation'
import { forgotPassword } from '../../services/auth'

const Register: React.FC = (): JSX.Element => {
  const [validEmail, setValidEmailState] = React.useState(false)
  const [apiResponse, setApiResponse] = React.useState<{ message: string; error: boolean } | undefined>()
  let email: string | undefined

  async function submitRequest(): Promise<void> {
    if (validEmail && typeof email !== 'undefined') {
      const response = await forgotPassword(email)

      if (typeof response === 'string') {
        // something went wrong with the API request
        setApiResponse({ message: response, error: true })
      } else {
        // valid request
        setApiResponse({ message: response.message, error: false })
      }
    }
  }

  function emailChange(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void {
    const _email = event.target.value

    if (!isValidEmail(_email)) {
      setValidEmailState(false)
      return
    }

    setValidEmailState(true)
    email = _email
  }

  return (
    <Wrapper flex center bgLight>
      <Container column justifyCenter alignCenter>
        <Title color={LIGHT}>Forgot password</Title>

        <ForgotPasswordForm column justifyCenter alignCenter>
          {typeof apiResponse !== 'undefined' && <Text color={apiResponse.error ? 'red' : 'green'}>{apiResponse.message}</Text>}
          <Text>Did you loose your password? Enter your e-mail address and you will receive an e-mail with instructions on how to change your password.</Text>
          <TextField label="email" name="email" placeholder="email" fullWidth error={!validEmail} helperText={validEmail ? null : 'Invalid email'} onChange={emailChange} />
          <FormButton
            disabled={!validEmail}
            onClick={(): void => {
              void submitRequest()
            }}
          >
            Submit
          </FormButton>
        </ForgotPasswordForm>
      </Container>
    </Wrapper>
  )
}

export default Register
