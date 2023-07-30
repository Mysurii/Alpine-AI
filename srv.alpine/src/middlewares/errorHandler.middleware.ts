import type { Request, Response, NextFunction } from 'express'
import type { HTTP_STATE, HTTP_STATUS } from '@common/interfaces/http'
import BaseError from '@common/helpers/errors/base.error'

const errorHandler = async (err: any, req: Request, res: Response, next: NextFunction) => {
  let message: string = err?.message ? err.message : 'Something went wrong on the server'
  let status: number = err.code ? err.code : 500
  let type: HTTP_STATUS = 'internal_server'

  console.log('in here!!')

  if (err instanceof BaseError) {
    message = err.message
    status = err.status
    type = err.type
  }

  return res.status(status).json({ error: { type, message, date: new Date() } })
}

export default errorHandler
