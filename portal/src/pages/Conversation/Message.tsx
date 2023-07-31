import Bubble from '../../components/Chatbot/Bubble'
import React from 'react'
import { IMessage, Sender } from '../../types/IMessage'
import { ButtonContainer, StyledBtn } from './styles'

interface IProps {
  message: IMessage
}

const Message: React.FC<IProps> = ({ message }): JSX.Element => {
  console.log(message)
  if (message.type === 'button') {
    return (
      <ButtonContainer>
        <StyledBtn variant="outlined">{message.text}</StyledBtn>
      </ButtonContainer>
    )
  }
  return <Bubble isSelfMessage={message.sender === Sender.SELF}>{message.text}</Bubble>
}

export default Message
