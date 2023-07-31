import styled from '@emotion/styled'
import { Container as MuiContainer, TableContainer } from '@mui/material'
import { DARK, LIGHT } from '../../../constants/colors'
import { Flex } from '../../../components/global.styles'

export const Container = styled(MuiContainer)`
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
  height: 75vh;
  background-color: #fffffd;
  color: black;
  padding: 20px;
  border-radius: 25px;
  font-weight: bold;
  border: 5px solid #17132a;
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */

  &::-webkit-scrollbar {
    display: none;
  }
`

export const Title = styled('h1')`
  font-size: 1.6rem;
  margin-bottom: 25px;
  color: #e94560;
`

export const PropertyTitle = styled('h3')`
  color: #e94560;
`
export const NotSelectedContainer = styled(Flex)`
  height: 100vh;
  display: flex;
`
export const InnerContainer = styled(Flex)`
  width: 100%;
  height: 100%;
`

export const CustomContainer = styled(Flex)`
  width: 50%;
  background-color: ${LIGHT};
  border-radius: 25px;
  padding: 20px;
  margin: 5px 0;
  border: 2px solid ${DARK};

  Button {
    margin: auto 10px;
    height: 100%;
  }
`

export const TContainer = styled(TableContainer)`
  background-color: ${LIGHT};
  margin-top: 20px;
`
