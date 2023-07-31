import styled from '@emotion/styled'
import { Container as MuiContainer } from '@mui/material'
import { DARK, LIGHT, PRIMARY } from '../../../constants/colors'
import { Flex } from '../../../components/global.styles'
import { IoMdClose } from 'react-icons/io'

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
  color: ${PRIMARY};
`
export const SubTitle = styled('h3')`
  font-size: 1.6rem;
  margin-bottom: 25px;
  font-weight: 500;
`
export const PatternsContainer = styled('div')`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;
`
export const InputContainer = styled('div')`
  padding: 30px;
  border-radius: 25px;
  display: flex;
  flex-direction: column;
  gap: 30px;
  background-color: white;
  max-height: 70vh;
  overflow-y: auto;
`
export const SelectImage = styled('img')`
  width: 250px;
  margin-top: 100px;
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
  height: min-content;
  background-color: ${LIGHT};
  border-radius: 15px;
  padding: 20px;
  border: 2px solid ${DARK};
`

// CHATBOT
export const ChatbotContainer = styled('div')`
  z-index: 999;
  width: 400px;
  height: 60vh;
  margin-top: 50px;
  background-color: white;
  border-radius: 10px;
  -moz-box-shadow: 0 0 3px #ccc;
  -webkit-box-shadow: 0 0 3px #ccc;
  box-shadow: 0 0 3px #ccc;

  @media (max-width: 768px) {
    width: 100%;
  }
`

interface IHeader {
  background?: string
  titlecolor?: string
}

export const Header = styled(Flex)<IHeader>`
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;
  height: 50px;
  padding-left: 30px;
  background-color: ${(props) => props.background ?? PRIMARY};

  h2 {
    color: ${(props) => (props.titlecolor ? props.titlecolor : LIGHT)};
  }
`
interface ICloseBtn {
  color?: string
}

export const CloseBtn = styled(IoMdClose)<ICloseBtn>`
  cursor: pointer;
  margin-right: 10px;
  font-size: 1.6rem;
  transition: all 0.3 ease;
  color: ${(props) => (props.color ? props.color : DARK)};

  &:hover {
    transform: scale(1.05);
    color: #000;
  }
`
export const MessagesList = styled(Flex)`
  padding: 20px 10px 10px 10px;
  min-height: 80%;
  max-height: 90%;
  overflow-y: auto;
  background: #fcfcfc;
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */

  &::-webkit-scrollbar {
    display: none;
  }
`
