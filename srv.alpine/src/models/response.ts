import type { HTTP_STATE } from '../util/endpoint-util'

export type ErrorResponse = {
  message: string,
  error: HTTP_STATE['status'],
  status: HTTP_STATE['code']
}