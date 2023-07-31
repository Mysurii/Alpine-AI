import styled from '@emotion/styled'
import { DARK, PRIMARY } from '../../constants/colors'

export const Container = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: ${DARK};
  color: ${PRIMARY};
`
export const StyledImage = styled.img`
  max-width: 350px;
  margin-top: 50px;
`
