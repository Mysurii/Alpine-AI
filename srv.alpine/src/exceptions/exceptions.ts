import type { Request, Response, NextFunction, RequestHandler } from 'express'
import { isValidId } from '../util/util'
import { escape } from '../middlewares/generalMiddlewares'
import type { HTTP_STATE} from '../util/endpoint-util'
import { HTTP_STATUS } from '../util/endpoint-util'

export class ApiErrorResponse {
  message: string
  status: HTTP_STATE

  constructor (message: string, status: HTTP_STATE) {
    this.message = message
    this.status = status
  }
}

export class ApiException extends ApiErrorResponse {
  error: Error

  constructor (message: string, error: Error) {
    super(message, HTTP_STATUS.INTERNAL_SERVER)
    this.error = error
  }
}

// Exceptions
export const LOG_EXCEPTION = (error: Error) => new ApiException('SOmething went wrong with inserting the log', error)

// Errors
export const NOT_FOUND = (message: string) => new ApiErrorResponse(message, HTTP_STATUS.NOT_FOUND)
export const INVALID_REQUEST_PARAMETER = (message: string) => new ApiErrorResponse(message, HTTP_STATUS.BAD)
export const MISSING_BODY = (message: string) => INVALID_REQUEST_PARAMETER(message)
export const WRONG_CREDENTIALS = () => new ApiErrorResponse('Email and password combination is not correct', HTTP_STATUS.UNAUTHORIZED)
export const INVALID_PASSWORD = () => MISSING_BODY('Password not correct')
export const INVALID_EMAIL = () => MISSING_BODY('Email is not valid')
export const INSECURE_PASSWORD = () => MISSING_BODY('Password not strong enough')
export const INVALID_VALUE = INVALID_REQUEST_PARAMETER
export const INVALID_ID = () => INVALID_REQUEST_PARAMETER('Given id is not valid')
export const BODY_NOT_PARSABLE = () => INVALID_REQUEST_PARAMETER('Body is not parsable')
export const USER_NOT_SET = () => NOT_FOUND('User not set')

// route wrapper
export function AsyncRouteWrapper(route: (req: Request, res: Response, next: NextFunction) => Promise<Response | void>): RequestHandler {
  return async (request: Request, response: Response, next: NextFunction) => {
    try {
      // the request queries can only be retrieved when the route is called
      request.params = parseQuery(request.params, next)
      return await route(request, response, next)
    } catch (error) {
      next((error instanceof ApiException || error instanceof ApiErrorResponse) ? error : new ApiException('Something went wrong on the server...', error as Error))
    }
  }
}

export function RouteWrapper(route: (req: Request, res: Response, next: NextFunction) => Response | void): RequestHandler {
  return (request: Request, response: Response, next: NextFunction) => {
    try {
      // the request queries can only be retrieved when the route is called
      request.params = parseQuery(request.params, next)
      return route(request, response, next)
    } catch (error) {
      next((error instanceof ApiException || error instanceof ApiErrorResponse) ? error : new ApiException('Something went wrong on the server...', error as Error))
    }
  }
}

function parseQuery(params: Record<string, string>, next: NextFunction): Record<string, string> {
  params = escape(params)
  if (params != null && 'id' in params && typeof params.id === 'string') {
    if (!isValidId(params.id)) {
      next(INVALID_ID())
    }
  }

  return params
}