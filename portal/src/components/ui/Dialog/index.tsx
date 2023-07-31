import { Button, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material'
import React from 'react'
import { StyledForm } from './styles'

interface IProps {
  title: string
  description?: string
  isOpen: boolean
  children: React.ReactNode
  onClose: () => void
  onSubmit: () => void
}

const Dialog: React.FC<IProps> = ({ title, description, isOpen, onClose, onSubmit, children }): JSX.Element => {
  return (
    <StyledForm open={isOpen} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{description}</DialogContentText>
        {children}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button onClick={onSubmit} color="success">
          Save
        </Button>
      </DialogActions>
    </StyledForm>
  )
}

export default Dialog
