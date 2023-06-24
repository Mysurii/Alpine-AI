import { sendError } from '../helpers/endpoint-utils'
import { ApiError } from '../helpers/exceptions'
import { HTTP_STATUS, type HTTP_STATE } from '../types/http'
import type { Request, Response, NextFunction } from 'express'

export async function errorHandler(error: unknown, _: Request, response: Response, next: NextFunction): Promise<void> {
  let message: string
  let status: HTTP_STATE

  if (error instanceof ApiError) {
    message = error.message
    status = error.status
  } else {
    message = 'Something went wrong on the server...'
    status = HTTP_STATUS.INTERNAL_SERVER
  }

  return sendError(response, status, message)
}
