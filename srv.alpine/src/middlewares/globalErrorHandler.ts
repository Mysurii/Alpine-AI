import type { Request, Response, NextFunction } from 'express'
import type { HTTP_STATE, HTTP_STATUS } from '@interfaces/http'
import BaseError from '@utils/errors/base.error'

const errorHandler = async (err: unknown, req: Request, res: Response, next: NextFunction) => {
  let message: string = 'Something went wrong on the server'
  let status: number = 500
  let type: HTTP_STATUS = 'internal_server'

  if (err instanceof BaseError) {
    message = err.message
    status = err.status
    type = err.type
  }

  return res.status(status).json({ date: new Date(), error: { type, message } })
}

export default errorHandler
