import { Container, Flex } from '../../../components/global.styles'
import React, { useEffect } from 'react'
import useCustomizationsStore from '../../../stores/customization.store'
import { InnerContainer, CustomContainer, NotSelectedContainer, SelectImage, Title } from './customization.styles'
import selectImg from './images/select.svg'
import Panel from '../../../components/ui/Panel'
import { Button, TextField } from '@mui/material'
import Chatbot from './Chatbot'
import ICustomization from 'types/ICustomization'
import { isColor } from '../../../utils/validation'
import { useLoaderData } from 'react-router-dom'
import useChatbotStore from '../../../stores/chatbot.store'
import withNavbarProvided from '../../../components/Navbar'
import withAuthRequired from '../../../components/AuthGuard/withAuthRequired'
import { toast } from 'react-toastify'
import { PRIMARY } from '../../../constants/colors'

const NON_COLOR_FIELDS = ['avatar', 'name']

const Customization = (): JSX.Element => {
  const [loading, setLoading] = React.useState(true)
  const { selectedChatbot, updateCustomization } = useChatbotStore()
  const { changeItem, currentItem, items, setCurrentItem, setItems } = useCustomizationsStore()

  // @ts-expect-error
  const { data: chatbot } = useLoaderData()

  useEffect(() => {
    if (chatbot) {
      useChatbotStore.setState({ selectedChatbot: chatbot })
      setLoading(false)
    }
  }, [chatbot])

  useEffect(() => {
    if (selectedChatbot) {
      setItems(selectedChatbot?.customization)
    }
  }, [])

  const item: keyof ICustomization = currentItem as keyof ICustomization

  const save = (): void => {
    updateCustomization(items)
      .then(() => toast.success('Succesfully updated!'))
      .catch(() => toast.error('Something went wrong..'))
  }

  const buttons = (
    <Button color="success" variant="contained" onClick={save}>
      Save
    </Button>
  )

  return (
    <>
      {!loading && selectedChatbot ? (
        <Container hasNav>
          <Panel title={`Customization: ${selectedChatbot.name}`} items={Object.keys(items)} active={currentItem} onClick={setCurrentItem} buttons={buttons}>
            {!currentItem ? (
              <NotSelectedContainer column justifyCenter alignCenter>
                <Flex column alignCenter>
                  <Title>None selected</Title>
                  <span style={{ fontSize: '1.3rem', color: PRIMARY }}>Please select an customization item on the panel left</span>
                </Flex>
                <SelectImage src={selectImg} alt="select" />
              </NotSelectedContainer>
            ) : (
              <InnerContainer column alignCenter>
                <CustomContainer>
                  <TextField
                    label={currentItem}
                    title={currentItem}
                    placeholder={currentItem}
                    variant="standard"
                    fullWidth
                    value={items[item]}
                    helperText={items[item].length > 0 && !NON_COLOR_FIELDS.includes(item) && isColor(items[item]) && 'Please provide a valid (hex)color'}
                    onChange={(e) => changeItem(currentItem, e.target.value)}
                  />
                </CustomContainer>
                <Chatbot />
              </InnerContainer>
            )}
          </Panel>
        </Container>
      ) : (
        <div>Loading</div>
      )}
    </>
  )
}

export default withAuthRequired(withNavbarProvided(Customization))
