import type { ErrorResponse } from 'types/response'
import rateLimit from 'express-rate-limit'

const rateLimitResponse: ErrorResponse = {
  status: 429,
  error: 'Too many requests',
  message: 'Too many requests, please try again later.',
}

const basicRateLimit: Parameters<typeof rateLimit>[0] = {
  windowMs: 900000, // 15 minutes
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: rateLimitResponse, // response if the rate limit has been reached
}

export const rateLimiter = rateLimit({
  max: 100,
  ...basicRateLimit,
})

export const loginRateLimiter = rateLimit({
  max: 15,
  ...basicRateLimit,
})
