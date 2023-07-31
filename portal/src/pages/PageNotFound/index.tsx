import { Container, StyledImage } from './styles'
import React from 'react'
import notFoundImage from './notfound.svg'
import { Title } from '../../components/global.styles'
import { PRIMARY } from '../../constants/colors'
import { Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'

const PageNotFound: React.FC = (): JSX.Element => {
  const navigate = useNavigate()
  return (
    <Container>
      <Title color={PRIMARY}>Page not found</Title>
      <Button variant="outlined" onClick={() => navigate('/')}>
        Return to homepage
      </Button>
      <StyledImage src={notFoundImage} alt="not found" />
    </Container>
  )
}

export default PageNotFound
