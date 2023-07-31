import { Flex } from '../../../components/global.styles'
import withAuthRequired from '../../../components/AuthGuard/withAuthRequired'
import withNavbarProvided from '../../../components/Navbar'
import { Title } from '../Customization/customization.styles'
import { CopyButton, CopyWrapper, Description, Explanation } from './styles'
import { DARK } from '../../../constants/colors'
import { Snackbar } from '@mui/material'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import useCustomizationsStore from '../../../stores/customization.store'
import { useParams } from 'react-router-dom'
import { getEncryptionKey } from '../../../services/chatbots'

function GenerateScript(): JSX.Element {
  const [open, setOpen] = useState<boolean>(false)
  const [key, setKey] = useState<string>('')

  const { items } = useCustomizationsStore()
  const { chatbotId } = useParams()

  const script: string = `
  <script
  src="https://cdn.jsdelivr.net/gh/mysurii/chatbot-frontend@v35/index.js"
  data-token="${key}"
  data-name="${items.name}"
  data-name-color="${items.titleColor}"
  data-header="${items.header}"
  data-close="${items.closeButton}"
  data-bubble-user="${items.bubbleUser}"
  data-bubble-bot="${items.bubbleBot}"
  data-send-button="${items.sendButton}"
  data-text-user="${items.textUser}"
  data-text-bot="${items.textBot}"
  data-avatar="${items.avatar}"
  defer
></script>
  `

  const link: string = '<link href="https://cdn.jsdelivr.net/gh/mysurii/chatbot-frontend@v35/styles.css" rel="stylesheet" />'

  const copyScriptToClipboard = (): void => {
    setOpen(true)
    navigator.clipboard.writeText(script).catch(() => toast.error('Could not copy to clipboard.'))
  }

  const copyLinkToClipboard = (): void => {
    setOpen(true)
    navigator.clipboard.writeText(link).catch(() => toast.error('Could not copy to clipboard.'))
  }

  useEffect(() => {
    const fetchKey = async (): Promise<string | null> => {
      if (chatbotId) {
        try {
          const res = await getEncryptionKey(chatbotId)
          if (res?.data?.key) {
            return res.data.key
          }
        } catch (err) {
          console.log(err)
        }
      }
      return null
    }
    if (chatbotId) {
      void fetchKey().then((key) => {
        if (key) setKey(key)
      })
    }
  }, [])

  return (
    <Flex alignCenter justifyCenter column style={{ height: '90vh' }}>
      <Title style={{ color: DARK, marginBottom: '15px' }}>Embed Chatbot</Title>
      <Explanation>Copy the script and link tag. Paste these in your html file to have your chatbot embedded.</Explanation>
      <Description>Link for chatbot styling</Description>
      <CopyWrapper>
        {link} <CopyButton onClick={copyLinkToClipboard} />
      </CopyWrapper>
      <Description>Script for chatbot</Description>
      <CopyWrapper>
        <Flex justifyCenter alignCenter column style={{ maxWidth: '80%' }}>
          <div style={{ maxWidth: '75%' }}>{script}</div>
        </Flex>
        <CopyButton onClick={copyScriptToClipboard} />
      </CopyWrapper>

      <Snackbar open={open} onClose={() => setOpen(false)} autoHideDuration={2000} message="Copied to clipboard" />
    </Flex>
  )
}

export default withAuthRequired(withNavbarProvided(GenerateScript))
