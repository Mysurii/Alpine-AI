import { create } from "zustand";
import IChatbot from "../types/chatbot.type";

interface ChatbotState {
  chatbot: IChatbot | undefined
  intents: IChatbot['intents']
  customization: IChatbot['customization'] | object
  addOrUpdateIntent: () => void
  addOrUpdateCustomization: () => void
  deleteIntent: () => void
  deleteCustomization: () => void
  restore: () => void
  save: () => void
}

const useChatbotStore = create<ChatbotState>((set, get) => ({
  chatbot: undefined,
  intents: [],
  customization: {},
  addOrUpdateCustomization: () => {

  },
  addOrUpdateIntent: () => {

  },

  deleteCustomization: () => {

  },
  deleteIntent: () => {

  },
  restore: () => {

  },
  save: () => {
    
  }
}))