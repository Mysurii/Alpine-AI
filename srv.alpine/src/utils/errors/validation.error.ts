import BaseError from '@utils/errors/base.error'

class ValidationError extends BaseError {
  status = 400
  type = 'bad_request' as const

  constructor(message: string) {
    super(message)
  }

  serializeErrors() {
    return { message: this.message, status: this.status }
  }
}

export default ValidationError
