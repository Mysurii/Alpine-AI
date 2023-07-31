import { CloseButton, Container, HamburgerMenu, LinksContainer, LogoutBtn, MobileMenu, StyledLink, Title } from './styles'
import React, { useState, useEffect } from 'react'
import useChatbotStore from '../../stores/chatbot.store'
import useAuthStore from '../../stores/auth.store'
import { useNavigate, useParams } from 'react-router-dom'

const Navbar = (): JSX.Element => {
  const [show, setShow] = useState<boolean>(false)

  const { activeRoute, setActiveRoute } = useChatbotStore()
  const { logoutUser } = useAuthStore()

  const params = useParams<{ chatbotId: string }>()
  const id: string = params.chatbotId ?? ''

  const navigate = useNavigate()

  useEffect(() => {
    console.log(id)
    if (!id || id.length === 0) {
      navigate('/')
    }
  }, [])

  const links = (): JSX.Element => (
    <LinksContainer>
      <StyledLink to={`/builder/${id}/customization`} isActiveRoute={activeRoute === 'customization'} onClick={() => setActiveRoute('customization')}>
        customization
      </StyledLink>
      <StyledLink to={`/builder/${id}/intents`} isActiveRoute={activeRoute === 'intents'} onClick={() => setActiveRoute('intents')}>
        intents
      </StyledLink>
      <StyledLink to={`/${id}/conversation`} isActiveRoute={activeRoute === 'conversation'} onClick={() => setActiveRoute('conversation')}>
        conversation
      </StyledLink>
      <StyledLink to={`/builder/${id}/script`} isActiveRoute={activeRoute === 'script'} onClick={() => setActiveRoute('script')}>
        generate script
      </StyledLink>
      <StyledLink to={'/'} isActiveRoute={activeRoute === 'manage chatbots'} onClick={() => setActiveRoute('manage chatbots')}>
        manage chatbots
      </StyledLink>
    </LinksContainer>
  )

  const mobileNav = (): JSX.Element => (
    <MobileMenu>
      <CloseButton onClick={() => setShow(false)} />
      <StyledLink to={`/builder/${id}/customization`} isActiveRoute={activeRoute === 'customization'} onClick={() => setActiveRoute('customization')}></StyledLink>

      {id ? links() : null}
      <LogoutBtn onClick={logoutUser}>Logout</LogoutBtn>
    </MobileMenu>
  )

  return (
    <Container>
      <Title>Alpine</Title>
      <HamburgerMenu onClick={() => setShow(true)} />
      {show ? mobileNav() : null}
    </Container>
  )
}

const withNavbarProvided = (Component: React.ComponentType) => {
  return function NavbarProvided(props: any): JSX.Element {
    return (
      <>
        <Navbar />
        <Component {...props} />
      </>
    )
  }
}

export default withNavbarProvided
