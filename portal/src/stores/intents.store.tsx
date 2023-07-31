import IIntent from '../types/IIntent'
import create from 'zustand'

interface IntentState {
  currentItem: IIntent | undefined
  items: IIntent[]
  setCurrentItem: (arg: string) => void
  setItems: (args: IIntent[]) => void
  updatePattern: (pattern: string, idx: number) => void
  updateResponse: (type: string, text: string, idx: number) => void
  removeExcess: () => void
  addPattern: () => void
  addResponse: () => void
  addIntent: (tag: string) => void
  removePattern: (idx: number) => void
  removeResponse: (idx: number) => void
  removeIntent: (tag: string) => void
}

const useIntentsStore = create<IntentState>((set, get) => ({
  currentItem: undefined,
  items: [],
  setItems: (items: IIntent[]) => set((state) => ({ ...state, items })),
  setCurrentItem: (tag: string) => {
    const tags = get().items.map((x) => x.tag)
    const idx = tags.indexOf(tag)
    if (idx >= 0) {
      const foundIntent = get().items[idx]
      set((state) => ({ ...state, currentItem: foundIntent }))
    }
  },
  updatePattern: (pattern, idx) => {
    const current = get().currentItem

    if (current) {
      const currIdx = get().items.indexOf(current)

      const patterns = current?.patterns
      patterns[idx] = pattern
      current.patterns = patterns

      const copyItems = get().items
      copyItems[currIdx] = current

      set((state) => ({ ...state, items: copyItems }))
    }
  },
  updateResponse: (type, text, idx) => {
    const current = get().currentItem

    if (current) {
      const currIdx = get().items.indexOf(current)

      const responses = current?.responses

      responses[idx][0] = { type, text }

      current.responses = responses
      const copyItems = get().items
      copyItems[currIdx] = current

      set((state) => ({ ...state, items: copyItems }))
    }
  },
  removeExcess: () => {
    const intents = get().items
    const copyIntents = get().items

    intents.forEach((intent, idx) => {
      const filteredPatterns = intent.patterns.filter((pattern) => pattern !== '')
      const filteredResponses = intent.responses.filter((res) => res[0].text !== '')

      copyIntents[idx].patterns = filteredPatterns
      // @ts-expect-error
      copyIntents[idx].responses = filteredResponses
    })

    set((state) => ({ ...state, items: copyIntents }))
  },
  addPattern: () => {
    const current = get().currentItem

    if (current) {
      current.patterns.push('')
    }
  },
  addResponse: () => {
    const current = get().currentItem

    if (current) {
      // @ts-expect-error
      current.responses.push([{ type: 'text', text: '' }])
    }
  },
  addIntent: (tag) => {
    const newIntent: IIntent = {
      tag,
      patterns: [],
      responses: [],
      followUpQuestions: [],
      chatbotId: '',
    }

    const intents = get().items
    intents.push(newIntent)

    set((state) => ({ ...state, intents }))
  },
  removePattern: (idx) => {
    const current = get().currentItem
    current?.patterns.splice(idx, 1)
  },
  removeResponse: (idx) => {
    const current = get().currentItem
    current?.responses.splice(idx, 1)
  },
  removeIntent: (tag) => {
    const intents = get().items
    const tags = get().items.map((x) => x.tag)
    const idx = tags.indexOf(tag)

    if (idx >= 0) {
      intents.splice(idx, 1)
    }

    set((state) => ({ ...state, intents }))
    set((state) => ({ ...state, currentItem: undefined }))
  },
}))

export default useIntentsStore
