import styled from '@emotion/styled'
import { DARK, LIGHT, PRIMARY } from '../../constants/colors'
import { BiSend } from 'react-icons/bi'
import { Button } from '@mui/material'

export const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: calc(100vh - 60px);
  overflow: hidden;
  background-color: ${DARK};
`

export const InnerContainer = styled.div`
  width: 70%;

  @media (max-width: 768px) {
    width: 100%;
  }
`

export const Header = styled.div`
  width: 100%;
  height: 60px;
  display: flex;
  align-items: center;
  color: ${LIGHT};
  background-color: ${PRIMARY};
  border-left: 1px solid ${PRIMARY};
  border-right: 1px solid ${PRIMARY};
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
`
export const MessagesList = styled.div`
  width: 100%;
  height: 70vh;
  overflow-y: auto;
  background-color: ${LIGHT};
  padding: 10px;
`
export const InputContainer = styled.div`
  display: flex;
  align-items: center;
  background-color: ${LIGHT};
  /* border-top: 2px solid lightgray; */
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
`

export const SendButton = styled(BiSend)`
  font-size: 2.5rem;
  margin: 15px 50px 15px 0;
  color: ${PRIMARY};
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.1);
  }
`
export const ButtonContainer = styled.div`
  display: flex;
  gap: 15px;
  justify-content: flex-end;
  width: 90%;
  margin: 30px 15px 30px 0;
`
export const StyledBtn = styled(Button)`
  width: min-content;
`
