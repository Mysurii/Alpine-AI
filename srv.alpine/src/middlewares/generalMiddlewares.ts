/* eslint-disable @typescript-eslint/no-explicit-any */
import chalk from 'chalk'
import type { Request, Response, NextFunction } from 'express'
import { ApiErrorResponse, ApiException, BODY_NOT_PARSABLE, NOT_FOUND } from '../exceptions/exceptions'
import { getLogRepository } from '../repositories/repos'
import validator from 'validator'
import type { HTTP_STATE} from '../util/endpoint-util'
import { HTTP_STATUS, sendError } from '../util/endpoint-util'
import { env_variables } from '../config'

export function bodyCheckMiddleWare(error: { expose: boolean, statusCode: number, status: number, body: string, type: string }, _request: Request, response: Response, next: NextFunction) {
  if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
    return next(BODY_NOT_PARSABLE())
  }

  next()
}

export function escapeBodyMiddleware(request: Request, __: Response, next: NextFunction): void {
  // escape strings
  request.body = escape(request.body)
  request.query = escape(request.query)

  next()
}

function parseAccordingly(value: any): any {
  if (typeof value === 'string') {
    return validator.escape(value)
  } else if (value instanceof Array) {
    value.map(val => parseAccordingly(val))
  }

  return value
}


export function escape<T>(value: T): T {
  if (typeof value !== 'undefined') {
    if (typeof value === 'string' || value instanceof Array) {
      value = parseAccordingly(value)
    } else if (typeof value === 'object' && value != null) {
      value = Object.entries(value).reduce((accumulator, [key, value]) => {
        accumulator[key] = parseAccordingly(value)
        return accumulator
      }, {} as any)
    }
  }

  return value
}

export function notFoundMiddleware(_: Request, __: Response, next: NextFunction): void {
  return next(NOT_FOUND('Endpoint does not exist'))
}

export async function errorHandlerMiddleware(error: any, _: Request, response: Response, __: NextFunction): Promise<void> {
  const logRepository = getLogRepository()

  let message: string
  let status: HTTP_STATE

  if (error instanceof ApiErrorResponse) {
    message = error.message
    status = error.status

    if (error instanceof ApiException) {
      interface Log {
        type: 'error' | 'warning' | 'info',
        from: 'CLIENT' | 'SERVER',
        createdAt: Date,
        log: {
          [key: string]: string|Date
        }
      }

      const log: Log = {
        type: 'error',
        from: 'SERVER',
        createdAt: new Date(),
        log: {
          error: error.error?.message ?? console.trace()
        }
      }

      if (error.error?.stack) {
        log.log.stack = error.error.stack
      }

      if (env_variables.CONSOLE_ERROR_LOGGING === 'true') {
        console.error(log)
      }

      await logRepository.addLog(log)
      console.log(chalk.yellow('Log send to the database'))
    }
  } else {
    message = 'Something went wrong on the server...'
    status = HTTP_STATUS.INTERNAL_SERVER
  }

  return sendError(response, status, message)
}