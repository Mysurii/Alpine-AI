import type { Application, Router } from 'express'
import type { RateLimitRequestHandler } from 'express-rate-limit'
import { ChatBotController } from './controllers/chatBotController'
import { LogController } from './controllers/logController'
import { LoginController } from './controllers/loginController'
import { UserController } from './controllers/UserController'
import { loginRateLimiter } from './middlewares/rateLimitMiddleware'
import {LogoutController} from './controllers/logoutController'

export const _routes: [string, Router, RateLimitRequestHandler?][] = [
  ['/log', LogController],
  ['/login', LoginController, loginRateLimiter],
  ['/chatbots', ChatBotController],
  ['/user', UserController],
  ['/logout', LogoutController]
]

export const routes = (app: Application) => {
  _routes.forEach(([url, controller, rateLimiter]) => {
    if (typeof rateLimiter !== 'undefined') {
      app.use(url, controller, rateLimiter)
    } else {
      app.use(url, controller)
    }
  })
}
