import type superagent from 'superagent'
import type { Account, SuccessLogin } from '../../../src/models/authentication'
import { HTTP_STATUS } from '../../../src/util/endpoint-util'
import type { Chatbot, CreateChatbot } from '../../../src/models/chatbot'
import { request } from './helper'

export async function deleteChatbot<T>(id: Chatbot['_id'], expectedStatusCode = HTTP_STATUS.OK.code, accessToken?: SuccessLogin['accessToken']): Promise<{ response: superagent.Response, body: T }> {
  const response = await request.delete(`/chatbots/${id}`, expectedStatusCode, undefined, accessToken)

  return { response, body: response.body }
}

export async function getChatbots<T>(expectedStatusCode = HTTP_STATUS.OK.code, accessToken?: SuccessLogin['accessToken']): Promise<{ response: superagent.Response, body: T }> {
  const response = await request.get('/chatbots', expectedStatusCode, undefined, accessToken)

  return { response, body: response.body }
}

export async function getChatbot<T>(id: string, expectedStatusCode = HTTP_STATUS.OK.code, accessToken?: SuccessLogin['accessToken']): Promise<{ response: superagent.Response, body: T }> {
  const response = await request.get(`/chatbots/${id}`, expectedStatusCode, undefined, accessToken)

  return { response, body: response.body }
}

export async function createModifyChatbot<T>(chatbot: Partial<CreateChatbot> & { _id?: Account['_id'] }, expectedStatusCode = HTTP_STATUS.CREATED.code, accessToken?: SuccessLogin['accessToken']): Promise<{ response: superagent.Response, body: T }> {
  let req: superagent.Request

  if ('_id' in chatbot && typeof chatbot._id !== 'undefined') {
    req = request.patch(`/chatbots/${chatbot._id}`, expectedStatusCode, undefined, accessToken).send(chatbot)
  } else {
    req = request.post('/chatbots', expectedStatusCode, undefined, accessToken).send(chatbot)
  }

  const response = await req

  return { response, body: response.body }
}