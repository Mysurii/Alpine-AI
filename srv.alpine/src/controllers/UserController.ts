import type { Request, Response } from 'express'
import { Router } from 'express'
import { AsyncRouteWrapper } from '../exceptions/exceptions'
import { HTTP_STATUS, sendResponse } from '../util/endpoint-util'

export const UserController: Router = Router()

// request to check if the user has a valid access token
// no checks are needed since the authorization middleware handles all that
UserController.get('/verify', AsyncRouteWrapper(async (_request: Request, response: Response) => {
  sendResponse(response, HTTP_STATUS.NO_CONTENT)
}))