import React from 'react'
import { ListItem, ListItemButton, ListItemText } from '@mui/material'

interface IProps {
  text: string
  isactive: boolean
}

const Item = ({ text }: IProps): JSX.Element => {
  return (
    <ListItem disablePadding sx={{ cursor: 'pointer', zIndex: -5 }}>
      <ListItemButton>
        <ListItemText primary={text} />
      </ListItemButton>
    </ListItem>
  )
}

export default Item
