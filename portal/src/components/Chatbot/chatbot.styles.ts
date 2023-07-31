import styled from '@emotion/styled'
import { AiOutlineSend } from 'react-icons/ai'
import { Flex } from '..//global.styles'

interface ISelfMessage {
  isSelfMessage?: boolean
}
interface IBubbleProps extends ISelfMessage {
  textColor: string
  bubbleColor: string
}

export const BubbleContainer = styled(Flex)<ISelfMessage>`
  min-height: 50px;
  display: flex;
  align-items: end;
  margin-top: 5px;
  width: 100%;
  display: flex;
  justify-content: flex-end;
`
export const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 70%;
`
const Bubble = styled.div<IBubbleProps>`
  font-size: 0.9rem;
  min-width: 50px;
  color: ${(props) => (props.textColor ? props.textColor : '#fff')};
  background: ${(props) => (props.bubbleColor ? props.bubbleColor : '#fff')};
`
export const SelfBubble = styled(Bubble)<IBubbleProps>`
  padding: 10px 15px 10px 10px;
  text-align: right;
  border-radius: 5px 5px 0 5px;
`
export const BotBubble = styled(Bubble)<IBubbleProps>`
  padding: 10px 15px 10px 10px;
  text-align: left;
  border-radius: 5px 5px 5px 0;
`
export const Time = styled.div`
  color: lightgray;
  font-size: 0.8rem;
  text-align: right;
`
export const Button = styled.button`
  background-color: #ffffff;
  border: 1px solid #00d1b2;
  border-radius: 0.5rem;
  box-sizing: border-box;
  color: #111827;
  font-family: 'Inter var', ui-sans-serif, system-ui, -apple-system, system-ui, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji',
    'Segoe UI Symbol', 'Noto Color Emoji';
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1.25rem;
  padding: 0.75rem 1rem;
  text-align: center;
  text-decoration: none #d1d5db solid;
  text-decoration-thickness: auto;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  cursor: pointer;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;

  &:hover {
    background-color: rgb(249, 250, 251);
  }
  &:focus {
    outline: 2px solid transparent;
    outline-offset: 2px;
  }
  &:focus-visible {
    box-shadow: none;
  }
`

export const Avatar = styled('img')`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 10px;
`
export const ButtonContainer = styled(Flex)`
  width: 100%;
  display: flex;
  justify-content: flex-end;
`
export const ChildsContainr = styled('div')`
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding-right: 15px;
`
export const StyledInput = styled.input`
  color: #333;
  font-size: 1rem;
  border-radius: 0.2rem;
  background-color: rgb(255, 255, 255);
  border: none;
  outline: 0;
  height: 80%;
  width: 60%;
  display: block;
`
export const InputContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
  height: 6vh;
  width: 100%;
  background-color: white;
  border-top: 1px solid #e0e0e0;

  border-bottom-left-radius: 10px;

  border-bottom: 1px solid lightgray;
`
export const SendButton = styled(AiOutlineSend)`
  font-size: 1.5rem;
  color: gray;
  margin-right: 20px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:hover {
    color: #00d1b2;
    transform: scale(1.05);
  }
`
