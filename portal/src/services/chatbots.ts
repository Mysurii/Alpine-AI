import { deleteRq, get, patch, post } from './requests'
import { AxiosResponse } from 'axios'
import IChatbot from 'types/IChatbot'
import { LoaderFunction } from 'react-router-dom'

export async function getChatbotById(_id: string): Promise<AxiosResponse | undefined> {
  return await get(`chatbots/${_id}`)
}

export async function getChatbots(): Promise<AxiosResponse | undefined> {
  return await get('chatbots')
}

export async function createNewChatbot(chatbot: Partial<IChatbot>): Promise<AxiosResponse | undefined> {
  try {
    return await post('chatbots', chatbot)
  } catch (err: any) {
    console.log(err)
  }
}

export async function deleteChatbot(chatbotId: string): Promise<AxiosResponse | undefined> {
  return await deleteRq(`chatbots/${chatbotId}`)
}

export async function getResponse(chatbotId: string, message: string): Promise<AxiosResponse | undefined> {
  return await post(`chatbots/${chatbotId}/response`, { message })
}

export async function updateCustomization(chatbot: IChatbot): Promise<AxiosResponse | undefined> {
  return await patch(`chatbots/${chatbot._id}`, {
    name: chatbot.customization.name,
    customization: chatbot.customization,
  })
}

export async function updateIntents(chatbot: IChatbot): Promise<AxiosResponse | undefined> {
  return await patch(`chatbots/${chatbot._id}`, {
    intents: chatbot.intents,
  })
}

export async function trainChatbot(_id: string): Promise<AxiosResponse | undefined> {
  return await post(`chatbots/${_id}/train`, {})
}

export const getChatbotFromParams: LoaderFunction = async ({ params }) => {
  const { chatbotId } = params
  if (!chatbotId) {
    return null
  }
  const chatbot = await getChatbotById(chatbotId)
  return chatbot
}

export const getEncryptionKey = async (chatbotId: string): Promise<AxiosResponse | undefined> => {
  return await post(`chatbots/${chatbotId}/encryptionKey`, {})
}
