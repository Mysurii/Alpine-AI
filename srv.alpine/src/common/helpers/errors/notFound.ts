import BaseError from '@common/helpers/errors/base.error'

class NotFound extends BaseError {
  status = 404
  type = 'not_found' as const

  constructor(message: string) {
    super(message)
  }
}

export default NotFound
