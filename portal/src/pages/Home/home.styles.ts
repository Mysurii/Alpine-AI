import styled from '@emotion/styled'
import { Flex, Grid } from '../../components/global.styles'
import { DARK, DARKER, LIGHT, PRIMARY } from '../../constants/colors'
import { ButtonBase, Dialog, Menu, MenuItem, TextField } from '@mui/material'
import { MdOutlineTipsAndUpdates } from 'react-icons/md'
import { RxDot } from 'react-icons/rx'
import { AiOutlineLine } from 'react-icons/ai'
import { IoAnalytics, IoChatbubblesOutline } from 'react-icons/io5'
import { TbHandClick } from 'react-icons/tb'

export const Description = styled.p`
  color: ${LIGHT};
  font-size: 1.2rem;

  @media (max-width: 768px) {
    text-align: center;
  }
`

export const ChatbotContainer = styled(Grid)`
  grid-template-columns: 1fr 1fr 1fr;
  gap: 5px 1%;
  align-items: center;
  width: 100%;
  max-width: 100%;

  @media (max-width: 993px) {
    grid-template-columns: 1fr;
  }
`

export const ButtonContainer = styled(Flex)``

export const ChatbotWrapper = styled(Flex)`
  position: relative;
  height: 300px;
  text-align: center;
  box-shadow: 2px 2px 8px 0 ${DARKER};
  border-radius: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: ${PRIMARY};
  max-width: 100%;
  &:hover {
    transform: scale(0.98);
    opacity: 70%;
  }
`

export const DeleteButtonWrapper = styled('div')`
  z-index: 90000000000;
  position: absolute;
  top: 0;
  right: 0;

  &:hover {
    opacity: 70%;
  }
`

export const InnerWrapper = styled(Flex)`
  gap: 50px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`
export const AddButton = styled(ButtonBase)`
  font-size: 3rem;
  padding: 10px;
  border-radius: 15px;
  transition: all 0.3s ease;
  cursor: pointer;
  background-color: ${PRIMARY};
  color: ${LIGHT};

  &:hover {
    transform: scale(0.98);
    opacity: 70%;
  }
`

export const StyledTextField = styled(TextField)`
  margin-top: 15px;
`
export const StyledForm = styled(Dialog)`
  .css-hz1bth-MuiDialog-container > * {
    background-color: ${LIGHT};
  }
`

export const Header = styled(Flex)`
  justify-content: space-between;
  align-items: center;
`
export const WelcomeSection = styled.h1`
  font-size: 1.1rem;
  color: ${DARK};
  width: max-content;
  text-align: start;
  width: 100%;
`
export const Name = styled.span`
  text-transform: lowercase;
  color: ${DARK};
`

export const NewsContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 5vh;
`
export const UpdateIcon = styled(MdOutlineTipsAndUpdates)`
  font-size: 2rem;
  color: ${DARK};
`
export const ChatIcon = styled(IoChatbubblesOutline)`
  font-size: 2rem;
  color: ${DARK};
`
export const AnalyticsIcon = styled(IoAnalytics)`
  font-size: 2rem;
  color: ${DARK};
`
export const Dot = styled(RxDot)`
  font-size: 1.8rem;
  color: ${DARK};
`
export const Version = styled.small`
  color: ${DARKER};
  margin-top: 0;
  margin-left: 50px;
`

export const StyledMenuItem = styled(MenuItem)`
  &:hover {
    background-color: rgb(255 255 255 / 4%);
  }
`

export const StyledMenu = styled(Menu)`
  & .MuiPaper-root {
    background-color: ${DARKER};
  }
`

export const Line = styled(AiOutlineLine)`
  font-size: 1.6rem;
`
export const NoChatbots = styled.div`
  margin-left: 50px;
  color: ${DARK};
  opacity: 0.5;
`
export const ClickIcon = styled(TbHandClick)`
  font-size: 1.3rem;
`
