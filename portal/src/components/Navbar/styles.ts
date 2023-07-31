import styled from '@emotion/styled'
import { DARK, DARKER, ERROR, LIGHT, PRIMARY } from '../../constants/colors'
import { Link } from 'react-router-dom'
import { HiMenuAlt3 } from 'react-icons/hi'
import { IoClose } from 'react-icons/io5'
import isPropValid from '@emotion/is-prop-valid'

export const Container = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 15px;
  width: 100%;
  min-height: 60px;
  color: ${PRIMARY};
  align-items: center;
  padding: 0 35px;
  background-color: ${DARK};
  border-bottom: 2px sold ${DARKER};
`
export const InnerContainer = styled.div`
  display: flex;
  justify-content: end;
  gap: 15px;
  width: 100%;
  height: 60px;
  align-items: center;
  padding-right: 20px;
  background-color: ${DARK};
`
interface ILinkProps {
  isActiveRoute?: boolean
}

export const StyledLink = styled(Link, {
  shouldForwardProp: (prop) => isPropValid(prop) && prop !== 'isActiveRoute',
})<ILinkProps>`
  font-size: 1.3rem;
  transition: all 0.3s ease;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: ${(props) => (props.isActiveRoute ? LIGHT : PRIMARY)};
  font-weight: ${(props) => (props.isActiveRoute ? 'bold' : 200)};

  &:hover {
    opacity: 80%;
    color: ${(props) => (props.isActiveRoute ? LIGHT : PRIMARY)};
    transform: ${(props) => (!props.isActiveRoute ? 'scale(0.98)' : null)};
  }
`
export const LogoutBtn = styled.p`
  font-size: 1.3rem;
  transition: all 0.3s ease;
  letter-spacing: 2px;
  text-transform: uppercase;
  cursor: pointer;
  color: ${PRIMARY};

  &:hover {
    opacity: 80%;
    transform: scale(0.98);
  }
`
export const HamburgerMenu = styled(HiMenuAlt3)`
  font-size: 2rem;
  cursor: pointer;
`

export const MobileMenu = styled.div`
  z-index: 9998;
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 30px;
  align-items: center;
  background-color: ${DARKER};
`
export const CloseButton = styled(IoClose)`
  z-index: 9999;
  position: fixed;
  top: 20px;
  right: 20px;
  font-size: 2rem;
  color: ${ERROR};
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.1);
  }
`
export const Title = styled.h3`
  font-size: 1.4rem;
  color: ${LIGHT};
  text-transform: uppercase;
  letter-spacing: 2px;
`
export const LinksContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;
`
