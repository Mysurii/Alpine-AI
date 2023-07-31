import { Container, Flex } from '../../../components/global.styles'
import React, { useEffect } from 'react'
import useIntentsStore from '../../../stores/intents.store'
import { InnerContainer, CustomContainer, NotSelectedContainer, Title, PropertyTitle } from './intents.styles'
import Panel from '../../../components/ui/Panel'
import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material'
import withAuthRequired from '../../../components/AuthGuard/withAuthRequired'
import { useLoaderData } from 'react-router-dom'
import useChatbotStore from '../../../stores/chatbot.store'
import { toast } from 'react-toastify'
import withNavbarProvided from '../../../components/Navbar'

const Intents = (): JSX.Element => {
  // TODO style page to look like the figma design
  const { selectedChatbot, updateIntents, trainChatbot } = useChatbotStore()
  const [loading, setLoading] = React.useState(true)
  // eslint-disable-next-line prettier/prettier
  const { currentItem, items, setCurrentItem, setItems, updatePattern, updateResponse, removeExcess, addPattern, addResponse, removePattern, removeResponse, addIntent, removeIntent } =
    useIntentsStore()

  // @ts-expect-error
  const { data: chatbot } = useLoaderData()

  useEffect(() => {
    if (chatbot) {
      useChatbotStore.setState({ selectedChatbot: chatbot })
      setItems(chatbot.intents)
      setLoading(false)
    }
  }, [chatbot])

  // TODO Add promise handling
  const save = (): void => {
    // TODO remove empty patterns and response
    console.log(items)
    removeExcess()
    console.log(items)
    updateIntents(items)
      .then(() => toast.success('Successfully updated intents!'))
      .catch(() => toast.error('Something went wrong..'))
  }

  // TODO Add promise handling
  const train = (): void => {
    if (selectedChatbot) {
      // TODO add loading
      trainChatbot(selectedChatbot._id)
        .then((rest) => {
          console.log(rest)
          toast.success('Successfully trained chatbot!')
        })
        .catch(() => toast.error('Something went wrong..'))
    }
  }

  const revertChanges = (): void => {
    console.log('revert')
    if (window.confirm('Do you want to revert to the last saved intents?')) {
      window.location.reload()
    }
  }

  const addPatt = (): void => {
    addPattern()
    setItems(items)
    toast.success('Pattern added!')
  }

  const addResp = (): void => {
    addResponse()
    setItems(items)
    toast.success('Response added!')
  }

  const removePatt = (idx: number): void => {
    // TODO add undo
    removePattern(idx)
    setItems(items)
    toast.success('Pattern removed!')
  }

  const removeResp = (idx: number): void => {
    // TODO add undo
    removeResponse(idx)
    setItems(items)
    toast.success('Response removed!')
  }

  const saveButton = (
    <Button color="success" variant="contained" onClick={save}>
      Save
    </Button>
  )

  const trainButton = (
    <Button color="success" variant="contained" onClick={train}>
      Train
    </Button>
  )
  const revertButton = (
    <Button color="warning" variant="contained" onClick={revertChanges}>
      Revert
    </Button>
  )

  const addInt = (): void => {
    const tag = prompt('Enter a tag name (max. 20 characters)')
    if (tag === null) return
    const tags = items.map((x) => x.tag)
    if (tag.length < 1 || tag.length > 20) {
      toast.error('Tag name is invalid, choose another name')
    } else if (tags.includes(tag)) {
      toast.error('Tag name already exists, choose another name')
    } else {
      addIntent(tag)
    }
  }

  const addIntentButton = (
    <Button color="success" variant="contained" onClick={addInt}>
      Add Tag
    </Button>
  )

  return (
    <>
      {!loading && selectedChatbot ? (
        <Container hasNav style={{ overflowY: 'auto' }}>
          <Panel title="Intents" items={items.map((i) => i.tag)} active={currentItem?.tag} onClick={setCurrentItem} buttons={[addIntentButton, saveButton, trainButton, revertButton]}>
            {!currentItem ? (
              <NotSelectedContainer column justifyCenter alignCenter>
                <Flex column alignCenter>
                  <Title>None selected</Title>
                  <span style={{ fontSize: '1.3rem', color: 'white' }}>Please select an intent item on the panel left</span>
                </Flex>
              </NotSelectedContainer>
            ) : (
              <InnerContainer column style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                <Title>
                  {currentItem?.tag}{' '}
                  <Button color="error" variant="contained" onClick={() => removeIntent(currentItem?.tag)}>
                    REMOVE TAG
                  </Button>
                </Title>
                <Title>Patterns</Title>
                {currentItem.patterns.map((pattern, idx) => (
                  <>
                    <CustomContainer style={{ width: '40%' }}>
                      <TextField variant="standard" fullWidth value={pattern} onChange={(e) => updatePattern(e.target.value, idx)} />
                      <Button
                        color="error"
                        variant="contained"
                        onClick={() => {
                          removePatt(idx)
                        }}
                      >
                        X
                      </Button>
                    </CustomContainer>
                  </>
                ))}
                <Button color="success" variant="contained" onClick={addPatt}>
                  +
                </Button>

                <Title>Responses</Title>
                {currentItem.responses.map((response, idx) => {
                  return (
                    <>
                      <PropertyTitle>Response - {idx}</PropertyTitle>
                      {response.map((respo) => (
                        <>
                          <div style={{ width: '40%' }}>
                            <Box
                              sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                bgcolor: 'background.paper',
                                borderRadius: 1,
                              }}
                            >
                              <CustomContainer>
                                <TextField variant="standard" fullWidth defaultValue={respo.text} onChange={(e) => updateResponse(respo.type, e.target.value, idx)} />
                              </CustomContainer>
                              <CustomContainer>
                                <FormControl fullWidth>
                                  <InputLabel>Type</InputLabel>
                                  <Select labelId="demo-simple-select-label" id="demo-simple-select" value={respo.type} label="Type" onChange={(e) => updateResponse(e.target.value, respo.text, idx)}>
                                    <MenuItem style={{ color: 'white' }} value={'text'}>
                                      Text
                                    </MenuItem>
                                    <MenuItem style={{ color: 'white' }} value={'button'}>
                                      Button
                                    </MenuItem>
                                  </Select>
                                </FormControl>
                                <Button
                                  color="error"
                                  variant="contained"
                                  onClick={() => {
                                    removeResp(idx)
                                  }}
                                >
                                  X
                                </Button>
                              </CustomContainer>
                            </Box>
                          </div>
                        </>
                      ))}
                    </>
                  )
                })}
                <Button color="success" variant="contained" onClick={addResp}>
                  +
                </Button>
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

export default withAuthRequired(withNavbarProvided(Intents))
