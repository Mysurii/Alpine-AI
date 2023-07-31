import Bubble from '../../../components/Chatbot/Bubble'
import React from 'react'
import { ChatbotContainer, CloseBtn, Header, MessagesList } from './customization.styles'
import useCustomizationsStore from '../../../stores/customization.store'
import { LIGHT } from '../../../constants/colors'
import Input from '../../../components/Chatbot/Input'
import { Button } from '@mui/material'
import withAuthRequired from '../../../components/AuthGuard/withAuthRequired'

const Chatbot = (): JSX.Element => {
  const { items } = useCustomizationsStore()

  console.log(items)

  return (
    <ChatbotContainer>
      <Header alignCenter justifyBetween titlecolor={items.titleColor} background={items.header}>
        <h2>{items.name}</h2>
        <CloseBtn color={items.closeButton} />
      </Header>
      <MessagesList column style={{ background: items.messagesList || LIGHT }}>
        <Bubble isSelfMessage={false}>Hello, my name is {items.name}, how are you today?</Bubble>
        <Bubble isSelfMessage={true}>Hey Eva! Nice to meet you!</Bubble>
        <Bubble isSelfMessage={true}>Got a question</Bubble>
        <Bubble isSelfMessage={false}>What is your question?</Bubble>
        <Bubble isButton>
          <Button variant="outlined">Help with login</Button>
          <Button variant="outlined">I can&lsquo;t register</Button>
          <Button variant="outlined">Goodbye!</Button>
        </Bubble>
      </MessagesList>
      <Input />
    </ChatbotContainer>
  )
}

export default withAuthRequired(Chatbot)
