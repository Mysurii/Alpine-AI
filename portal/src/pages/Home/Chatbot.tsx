import { ClickIcon, Description, StyledMenu, StyledMenuItem } from './home.styles'
import { AiOutlineRobot } from 'react-icons/ai'
import { DARK, DARKER, LIGHT } from '../../constants/colors'
import useChatbotStore from '../../stores/chatbot.store'
import { useNavigate } from 'react-router-dom'
import { Card, CardActionArea, CardContent, CardHeader, IconButton, ThemeProvider, Avatar, Dialog as MuiDialog, DialogTitle, DialogActions } from '@mui/material'
import React, { useMemo, useState } from 'react'
import { darkTheme } from '../../utils/theme'
import { FiMoreVertical } from 'react-icons/fi'
import { QueryObserverResult, useMutation } from '@tanstack/react-query'
import RoundedButton from '../../components/ui/Button/RoundedButton'
import { deleteChatbot } from '../../services/chatbots'
import { Flex } from '../../components/global.styles'

const colors = ['#1E90FF', '#DC143C', '#008000']

interface IChatbotCardProps {
  name: string
  description: string
  _id: string
  index: number
  refetchFn: () => Promise<QueryObserverResult<any, unknown>> | undefined
}

const Chatbot = ({ name, description, _id, index, refetchFn }: IChatbotCardProps): JSX.Element => {
  const { setActiveRoute } = useChatbotStore()
  const navigate = useNavigate()
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false)
  const open = Boolean(anchorEl)
  const handleSelect = (): void => {
    useChatbotStore.setState({ selectedChatbotId: _id })
    setActiveRoute('customization')
    navigate(`/builder/${_id}/customization`)
  }

  const handleClick = (event: React.MouseEvent<HTMLElement>): void => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = (): void => {
    setAnchorEl(null)
  }

  const openDeleteModal = (): void => {
    setIsDeleteOpen(true)
  }

  const deleteChatbotMutation = useMutation({
    mutationFn: async () => {
      return await deleteChatbot(_id)
    },
    onSuccess: () => {
      void refetchFn()
      console.log('success')
    },
  })

  const handleDeleteChatbot = (): void => {
    deleteChatbotMutation.mutate()
    setAnchorEl(null)
    setIsDeleteOpen(false)
  }

  const DeleteDialog = useMemo((): JSX.Element => {
    return (
      <MuiDialog title={'Delete chatbot'} open={isDeleteOpen} onClose={() => setIsDeleteOpen(false)}>
        <DialogTitle>
          Are you sure you want to delete chatbot &quot;{name}&quot;? <br />
          This action cannot be undone.
        </DialogTitle>
        <DialogActions>
          <RoundedButton
            onClick={() => {
              setAnchorEl(null)
              setIsDeleteOpen(false)
            }}
            primary={DARKER}
          >
            Cancel
          </RoundedButton>
          <RoundedButton onClick={handleDeleteChatbot} primary={DARK}>
            Delete
          </RoundedButton>
        </DialogActions>
      </MuiDialog>
    )
  }, [isDeleteOpen, name])

  const menu = useMemo(
    () => (
      <div>
        <IconButton aria-label="settings" onClick={handleClick}>
          <FiMoreVertical color={LIGHT} />
        </IconButton>
        <StyledMenu onClose={handleClose} open={open} anchorEl={anchorEl}>
          <StyledMenuItem>info</StyledMenuItem>
          <StyledMenuItem
            onClick={() => {
              navigate('/builder/' + _id + '/customization')
            }}
          >
            edit
          </StyledMenuItem>
          <StyledMenuItem sx={{ color: 'red' }} onClick={openDeleteModal}>
            delete
          </StyledMenuItem>
        </StyledMenu>
      </div>
    ),
    [open, anchorEl],
  )

  return (
    <ThemeProvider theme={darkTheme}>
      <Card>
        <CardHeader
          title={name}
          action={menu}
          subheader={`My name is ${name} and I am here to help!`}
          avatar={
            <Avatar variant={'rounded'} sx={{ width: 56, height: 56, bgcolor: colors[index] }}>
              <AiOutlineRobot size={40} />
            </Avatar>
          }
        />
        <CardActionArea onClick={handleSelect}>
          <CardContent>
            {description ? (
              <Flex justifyBetween>
                <Description>{description}</Description>
                <ClickIcon />
              </Flex>
            ) : (
              <Description>&nbsp;</Description>
            )}
          </CardContent>
        </CardActionArea>
      </Card>
      {DeleteDialog}
    </ThemeProvider>
  )
}

export default Chatbot
