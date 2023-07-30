import type { HTTP_STATUS } from '@common/interfaces/http'

abstract class BaseError extends Error {
  abstract status: number
  abstract type: HTTP_STATUS

  constructor(message: string) {
    super(message)
  }
}

export default BaseError
