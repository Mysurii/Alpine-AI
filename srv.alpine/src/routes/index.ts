import type { Application, Router } from 'express'
import type { RateLimitRequestHandler } from 'express-rate-limit'
import userController from '../controllers/user.controller'
import { loginRateLimiter } from '../middlewares/ratelimiter.middleware'

export const _routes: [ string, Router, RateLimitRequestHandler?][] = [
  [ '/api/auth', userController, loginRateLimiter ],
]

export const routes = ( app: Application ) => {
  _routes.forEach( ( [ url, controller, rateLimiter ] ) => {
    if ( typeof rateLimiter !== 'undefined' ) {
      app.use( url, controller, rateLimiter )
    } else {
      app.use( url, controller )
    }
  } )
}