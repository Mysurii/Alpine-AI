import styled from '@emotion/styled'
import { Button } from '@mui/material'

interface IProps {
  primary: string
  secondary: string
}

export const StyledBtn = styled(Button)<IProps>`
  background-color: ${(props) => props.primary};
  width: min-content;
  min-width: 150px;
  color: ${(props) => props.secondary};
  border-radius: 25px;
  border: 2px solid ${(props) => props.primary};

  &:hover {
    color: ${(props) => props.primary};
    background-color: ${(props) => props.secondary};
    border: 2px solid ${(props) => props.primary};
  }
`
