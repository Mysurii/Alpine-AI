import rateLimit from 'express-rate-limit'
import type { ErrorResponse } from '../models/response'

const rateLimitResponse: ErrorResponse = {
  status: 429,
  error: 'Too Many Requests',
  message: 'Too many requests, please try again later'
}

const basicRateLimit: Parameters<typeof rateLimit>[0] = {
  windowMs: 900000, // 15 minutes
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: rateLimitResponse // response if the rate limit has been reached
}

// create the rate limit
export const rateLimiter = rateLimit({
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  ...basicRateLimit
})

export const loginRateLimiter = rateLimit({
  max: 15, // Limit each IP to 15 requests per `window` (here, per 15 minutes)
  ...basicRateLimit
})