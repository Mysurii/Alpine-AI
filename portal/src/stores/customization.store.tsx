import { LIGHT, PRIMARY } from '../constants/colors'
import ICustomization from '../types/ICustomization'
import create from 'zustand'

const INITIAL_ITEMS = {
  name: 'Chatbot',
  header: PRIMARY,
  closeButton: LIGHT,
  titleColor: LIGHT,
  avatar: 'https://miro.medium.com/max/525/1*lyyXmbeoK5JiIBNCnzzjjg.png',
  messagesList: LIGHT,
  bubbleUser: 'gray',
  textUser: LIGHT,
  bubbleBot: PRIMARY,
  textBot: LIGHT,
  sendButton: PRIMARY,
}

interface CustomizationState {
  currentItem: string | undefined
  items: ICustomization
  changeItem: (key: string, value: string) => void
  setCurrentItem: (arg: string) => void
  setItems: (args: ICustomization) => void
}

const useCustomizationsStore = create<CustomizationState>((set, get) => ({
  currentItem: undefined,
  items: INITIAL_ITEMS,
  setCurrentItem: (item: string) => set((state) => ({ ...state, currentItem: item })),
  setItems: (items: ICustomization) => set((state) => ({ ...state, items })),
  changeItem: (key: string, value: string) => {
    const copy = { ...get().items }
    copy[key as keyof ICustomization] = value
    set((state) => ({ ...state, items: copy }))
  },
}))

export default useCustomizationsStore
