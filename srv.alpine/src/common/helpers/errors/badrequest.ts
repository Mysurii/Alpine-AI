import BaseError from '@common/helpers/errors/base.error'

class BadRequest extends BaseError {
  status = 400
  type = 'bad_request' as const

  constructor(message: string) {
    super(message)
  }
}

export default BadRequest
