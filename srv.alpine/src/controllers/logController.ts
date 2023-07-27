import type { Request, Response } from 'express'
import { Router } from 'express'
import { AsyncRouteWrapper, INVALID_VALUE, LOG_EXCEPTION } from '../exceptions/exceptions'
import type { Log } from '../models/log'
import { logTypes } from '../models/log'
import { getLogRepository } from '../repositories/repos'
import validator from 'validator'
import { HTTP_STATUS, sendError, sendResponse } from '../util/endpoint-util'

export const LogController: Router = Router()

const logRepository = getLogRepository()

LogController.head('/', AsyncRouteWrapper(async (_request: Request, response: Response) => {
  sendResponse(response, HTTP_STATUS.OK)
}))

LogController.post('/', AsyncRouteWrapper(async (request: Request, response: Response) => {
  const { type, log } = request.body

  if (type == null) {
    throw INVALID_VALUE('Log type not set')
  }

  if (!logTypes.includes(type)) {
    throw INVALID_VALUE(`Log type can only be of the following types: ${logTypes.join(', ')}`)
  }

  if (log == null) {
    throw INVALID_VALUE('Log not set')
  }

  const stack = recursiveStringEscape(log)

  const logObject: Log = {
    type,
    from: 'CLIENT',
    createdAt: new Date(),
    log: stack,
  }

  try {
    const dbResponse = await logRepository.addLog(logObject)

    if (!dbResponse.acknowledged) {
      return sendError(response, HTTP_STATUS.INTERNAL_SERVER, 'Unable to insert the log')
    }

    return sendResponse(response, HTTP_STATUS.CREATED)
  } catch (e) {
    throw LOG_EXCEPTION(e as Error)
  }
}))

function recursiveStringEscape(string: string | object): string | object {
  if (string instanceof Object) {
    return Object.entries(string).reduce<{ [key: string]: string | object }>((accumulator, [key, val]) => {
      accumulator[key] = recursiveStringEscape(val)

      return accumulator
    }, {})
  }

  return validator.escape(string.toString())
}