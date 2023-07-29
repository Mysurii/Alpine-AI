import type { HTTP_STATUS } from '@interfaces/http'

abstract class BaseError extends Error {
  abstract status: number
  abstract type: HTTP_STATUS

  constructor(message: string) {
    super(message)
  }

  abstract serializeErrors(): { message: string }
}

export default BaseError
