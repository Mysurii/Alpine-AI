import styled from '@emotion/styled'
import { LIGHT, PRIMARY } from '../../constants/colors'
import { GiMountainCave } from 'react-icons/gi'
import { Container, Flex } from '../../components/global.styles'

const ContainerStyles = styled(Flex)`
  padding: 0 25px;
  width: 50vw;
  height: 100%;
  gap: 5px;

  @media (max-width: 768px) {
    width: 100vw;
  }
`

export const Wrapper = styled(Container)`
  @media (max-width: 768px) {
    flex-direction: column;
  }
`

export const SignInContainer = styled(ContainerStyles)`
  background-color: ${PRIMARY};

  @media (max-width: 768px) {
    display: none;
  }
`
export const SmallLink = styled('small')`
  color: ${PRIMARY};
  display: block;

  @media (min-width: 768px) {
    display: none;
  }
`

export const RegisterContainer = styled(ContainerStyles)`
  background-color: ${LIGHT};
`

export const Form = styled('form')`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;
  width: 80%;
`

interface ILogo {
  color?: string
}

export const AlpineIcon = styled(GiMountainCave)<ILogo>`
  font-size: 6rem;
  color: ${(props) => (props.color ? props.color : LIGHT)};
`
export const ErrorMessage = styled('small')`
  color: red;
`
