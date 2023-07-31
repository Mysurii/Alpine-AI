import styled from '@emotion/styled'
import { DARKER, LIGHT, PRIMARY } from '../../constants/colors'
import { Flex } from '../../components/global.styles'

const ContainerStyles = styled(Flex)`
  padding: 0 25px;
  width: 50vw;
  height: 100%;
  gap: 5px;

  @media (max-width: 768px) {
    width: 100vw;
  }
`

export const LoginContainer = styled(ContainerStyles)`
  background-color: ${PRIMARY};
`

export const LoginContainerBox = styled('div')`
  padding: 25px;
  background-color: ${LIGHT};
  color: ${DARKER};
  width: 55%;
  border-radius: 25px;
  border: 1px solid ${PRIMARY};
`

export const SignUpContainer = styled(ContainerStyles)`
  background-color: ${LIGHT};
  @media (max-width: 768px) {
    display: none;
  }
`

export const Form = styled('div')`
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
`

export const SmallTextLink = styled.a`
  align-self: end;
  z-index: 2;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(0.98);
  }
`
