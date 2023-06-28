import type { HTTP_STATE } from './http'

export type ErrorResponse = {
  message: string
  error: HTTP_STATE['status']
  status: HTTP_STATE['code']
}

export type ChatbotResponse = {
  response: string | Array<{ text: string; type: 'text' }>
}
