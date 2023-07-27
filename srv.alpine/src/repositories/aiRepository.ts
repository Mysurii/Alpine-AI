import { env_variables } from '../config'
import type { Account } from '../models/authentication'
import type { Chatbot, ChatbotResponse } from '../models/chatbot'
import { HTTP_STATUS } from '../util/endpoint-util'
import HTTPRepository from './abstracts/httpRepository'

export default class AIRepository extends HTTPRepository {
  baseUrl = `${env_variables.AI_SERVER_URL}/api`

  async trainChatbot(userid: Account['_id'], chatbotId: Chatbot['_id']): Promise<boolean> {
    const { statusCode } = await this.post(`/chatbot/train?userid=${userid}&chatbotid=${chatbotId}`)

    return statusCode === HTTP_STATUS.CREATED.code
  }

  async getChatbotResponse(userid: Account['_id'], chatbotId: Chatbot['_id'], message: string) {
    const { body } = await this.post<ChatbotResponse>(`/chatbot/response?userid=${userid}&chatbotid=${chatbotId}`, { message })

    // if (body.response instanceof Array) {
    //   body.response = body.response[0].text
    // }

    return body
  }
}
