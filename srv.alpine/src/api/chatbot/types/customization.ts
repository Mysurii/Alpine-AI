const PRIMARY = '#6D8DFB'
const LIGHT = '#fffffd'

export const INITIAL_CUSTOMIZATION = {
  name: 'Alpine',
  nameColor: LIGHT,
  header: PRIMARY,
  close: LIGHT,
  messagesList: LIGHT,
  bubbleUser: 'gray',
  textUser: LIGHT,
  bubbleBot: PRIMARY,
  textBot: LIGHT,
  avatar: 'https://miro.medium.com/max/525/1*lyyXmbeoK5JiIBNCnzzjjg.png',
  sendButton: PRIMARY,
} as Customization

export type Customization = {
  name: string
  nameColor: string
  header: string
  close: string
  messagesList: string
  bubbleUser: string
  textUser: string
  bubbleBot: string
  textBot: string
  avatar: string
  sendButton: string
}
