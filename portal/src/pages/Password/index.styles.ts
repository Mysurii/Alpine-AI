import styled from '@emotion/styled'
import { DARK, LIGHT, PRIMARY } from '../../constants/colors'
import { Flex } from '../../components/global.styles'
import Button from '../../components/ui/Button/RoundedButton'

const ContainerStyles = styled(Flex)`
  padding: 0 25px;
  width: 100%;
  height: 100%;
  gap: 5px;

  @media (max-width: 768px) {
    width: 100vw;
  }
`

export const Container = styled(ContainerStyles)`
  background-color: ${PRIMARY};
`

export const ForgotPasswordForm = styled(Flex)`
  padding: 50px;
  border-radius: 10px;
  width: 20%;
  gap: 20px;
  background-color: ${LIGHT};
`

export const Text = styled('p')`
  font-size: 15px;
  color: ${(props) => (props.color ? props.color : DARK)};
`

export const FormFields = styled('div')`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`

export const FormButton = styled(Button)`
  width: 100%;
`

export const FormGroup = styled('div')`
  width: 100%;
  margin-bottom: 10px;
`
