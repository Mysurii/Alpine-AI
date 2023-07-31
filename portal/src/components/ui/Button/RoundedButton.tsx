import React from 'react'
import { StyledBtn } from './button.styles'
import { ButtonProps as MuiButtonProps } from '@mui/material'
import { LIGHT, PRIMARY } from '../../../constants/colors'

interface IProps extends MuiButtonProps {
  children: React.ReactNode
  primary?: string
  secondary?: string
}

const Button: React.FC<IProps> = ({ primary, secondary, children, ...props }) => {
  return (
    <StyledBtn primary={primary ?? PRIMARY} secondary={secondary ?? LIGHT} {...props}>
      {children}
    </StyledBtn>
  )
}

export default Button
