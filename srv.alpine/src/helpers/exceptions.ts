import type { HTTP_STATE } from '../types/http'
import { HTTP_STATUS } from '../types/http'

export class ApiError {
  message: string
  status: HTTP_STATE

  constructor(message: string, status: HTTP_STATE = HTTP_STATUS.INTERNAL_SERVER) {
    this.message = message
    this.status = status
  }
}

//errors
export const NOT_FOUND = (message: string) => new ApiError(message, HTTP_STATUS.NOT_FOUND)
export const INVALID_REQUEST_PARAMETER = (message: string) => new ApiError(message, HTTP_STATUS.BAD_REQUEST)
export const MISSING_BODY = (message: string) => INVALID_REQUEST_PARAMETER(message)
export const WRONG_CREDENTIALS = () =>
  new ApiError('Email and password combination is not correct', HTTP_STATUS.UNAUTHORIZED)
export const INSECURE_PASSWORD = () => MISSING_BODY('Password not strong enough')
export const INVALID_ID = () => INVALID_REQUEST_PARAMETER('Given id is not valid')
export const BODY_NOT_PARSABLE = () => INVALID_REQUEST_PARAMETER('Body is not parsable')
