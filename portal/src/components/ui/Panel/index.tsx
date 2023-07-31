import { Box, Divider, Drawer, List, ListItemButton, ListItemText } from '@mui/material'
import React, { useState } from 'react'
import { MdOutlineClose } from 'react-icons/md'
import { ButtonContainer, StyledListItem, Title } from './sidebar.styles'

const DRAWER_WIDTH = 240

interface IProps {
  title: string
  items: string[]
  active: string | undefined
  children: React.ReactNode
  buttons?: React.ReactNode
  onClick: (arg: string) => void
}

const Panel: React.FC<IProps> = ({ title, items, active, children, buttons, onClick }): JSX.Element => {
  const [mobileOpen, setMobileOpen] = useState(true)

  const drawer = (
    <Box style={{ zIndex: -5 }}>
      <Box
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: '100%' },
        }}
      >
        <MdOutlineClose
          style={{
            float: 'right',
            fontSize: '2rem',
            cursor: 'pointer',
            zIndex: '999',
            padding: '20px',
          }}
          onClick={() => {
            console.log('clicked')
            setMobileOpen(false)
          }}
        />
      </Box>

      <Title>{title}</Title>

      <List style={{ zIndex: -5, color: '#fff' }}>
        {items.map((text, index) => (
          <StyledListItem isactive={text === active} key={text} disablePadding onClick={() => onClick(text)}>
            <ListItemButton>
              <ListItemText primary={text} />
            </ListItemButton>
          </StyledListItem>
        ))}
        <ButtonContainer>{buttons}</ButtonContainer>
      </List>
      <Divider />
    </Box>
  )

  const handleDrawerToggle = (): void => {
    setMobileOpen(!mobileOpen)
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <Box component="nav" sx={{ width: { sm: DRAWER_WIDTH }, flexShrink: { sm: 0 } }} aria-label="mailbox folders">
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: DRAWER_WIDTH,
              background: '#17132a',
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: DRAWER_WIDTH,
              background: '#17132a',
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
          borderRadius: '25px',
        }}
      >
        <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
          <button onClick={() => setMobileOpen(true)}>open</button>
        </Box>

        {children}
      </Box>
    </Box>
  )
}

export default Panel
