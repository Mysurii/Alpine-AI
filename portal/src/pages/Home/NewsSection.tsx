import { Flex, Title } from '../../components/global.styles'
import React from 'react'
import { Dot, Line, NewsContainer, UpdateIcon, Version } from './home.styles'
import { DARK } from '../../constants/colors'

const NewsSection: React.FC = (): JSX.Element => {
  const NewsLine = (description: string): JSX.Element => (
    <Flex style={{ margin: '5px' }} alignCenter>
      <Dot />
      <p>{description}</p>
    </Flex>
  )

  return (
    <NewsContainer>
      <div style={{ marginBottom: '30px' }}>
        <Flex alignCenter style={{ gap: '15px' }}>
          <UpdateIcon />
          <Title color={DARK}>Latest update</Title>
        </Flex>
        <Version>Version 2.1</Version>
      </div>
      <Flex column>
        {NewsLine('You can now your very own chatbot. Keep in mind that the maxiumum amount is capped at 3.')}
        {NewsLine('You can now customize the looks of your chatbot!')}
        {NewsLine('Test your chatbot intents by having a conversation with them on the portal!')}
        {NewsLine('Train your chatbot')}
      </Flex>
      <Line />
    </NewsContainer>
  )
}

export default NewsSection
