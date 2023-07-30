import BaseError from '@common/helpers/errors/base.error'

class ServerError extends BaseError {
  status = 500
  type = 'internal_server' as const

  constructor(message: string) {
    super(message)
  }
}

export default ServerError
