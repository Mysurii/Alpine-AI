import { TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { Container, Header, InnerContainer, InputContainer, MessagesList, SendButton } from './styles'
import { IMessage, Sender } from '../../types/IMessage'
import { getResponse } from '../../services/chatbots'
import withAuthRequired from '../../components/AuthGuard/withAuthRequired'
import withNavbarProvided from '../../components/Navbar'
import Message from './Message'
import useChatbotStore from '../../stores/chatbot.store'
import { useLoaderData } from 'react-router-dom'

const INITIAL_MESSAGE: IMessage = {
  text: 'Hello!',
  type: 'text',
  sender: Sender.BOT,
}

const Conversation = (): JSX.Element => {
  const [messages, setMessages] = useState<IMessage[]>([INITIAL_MESSAGE])
  const [text, setText] = useState<string>('')

  // @ts-expect-error
  const { data: chatbot } = useLoaderData()

  useEffect(() => {
    if (chatbot) {
      useChatbotStore.setState({ selectedChatbot: chatbot })
    }
  }, [chatbot])

  const { selectedChatbot } = useChatbotStore()

  const handleScroll = (): void => {
    setTimeout(() => {
      const msgList = document.getElementById('messages-list')
      msgList?.scroll({ top: msgList.scrollHeight, behavior: 'smooth' })
    }, 150)
  }

  const onEnter = (e: React.KeyboardEvent): void => {
    if (e.key === 'Enter') handleSubmit()
  }

  const handleSubmit = (): void => {
    if (text === '') return

    const newMessage: IMessage = { text, type: 'text', sender: Sender.SELF }

    setMessages((prev) => [...prev, newMessage])
    handleScroll()
    if (selectedChatbot) {
      getResponse(selectedChatbot?._id, text)
        .then((response) => {
          const botResponses = response?.data.response

          botResponses.forEach((botResponse: IMessage) => {
            setTimeout(() => {
              const sender = botResponse.type === 'button' ? Sender.SELF : Sender.BOT
              const botMessage: IMessage = { text: botResponse.text, type: botResponse.type, sender }
              setMessages((prev) => [...prev, botMessage])
              handleScroll()
            }, 1000)
          })
        })
        .catch((err) => {
          console.log(err)
          const botMessage: IMessage = { text: 'Something went wrong with the server.. Please try again later.', type: 'text', sender: Sender.BOT }
          setMessages((prev) => [...prev, botMessage])
          handleScroll()
        })
    }

    setText('')
  }

  return (
    <Container>
      <InnerContainer>
        <Header>
          <p style={{ marginLeft: '20px' }}>Chatting with Eva</p>
        </Header>
        <MessagesList id="messages-list">
          {messages.map((message, idx) => (
            <Message message={message} key={idx} />
          ))}
        </MessagesList>
        <InputContainer>
          <TextField style={{ margin: '15px' }} variant="outlined" fullWidth placeholder="Type a message.." value={text} onChange={(e) => setText(e.target.value)} onKeyUp={onEnter} />
          <SendButton onClick={handleSubmit} />
        </InputContainer>
      </InnerContainer>
    </Container>
  )
}

export default withAuthRequired(withNavbarProvided(Conversation))
