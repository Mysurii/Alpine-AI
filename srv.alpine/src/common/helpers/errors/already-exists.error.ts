import BaseError from '@common/helpers/errors/base.error'

class AlreadyExists extends BaseError {
  status = 401
  type = 'bad_request' as const

  constructor(message: string) {
    super(message)
  }
}

export default AlreadyExists
