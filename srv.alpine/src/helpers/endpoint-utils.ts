import type { HTTP_STATE } from '../types/http'
import type { Request, Response } from 'express'
import { NOT_FOUND } from './exceptions'

export function sendResponse(response: Response, status: HTTP_STATE, responseBody?: unknown): void {
  response.status(status.code).send(responseBody)
}

export function sendError(response: Response, status: HTTP_STATE, message: string) {
  const responseMessage = {
    status: status.code,
    error: status.status,
    message: message,
  }

  sendResponse(response, status, responseMessage)
}

export function getUser(request: Request) {
  const user = request.user

  if (typeof user === 'undefined') {
    throw NOT_FOUND('User does not exist')
  }

  return user
}
