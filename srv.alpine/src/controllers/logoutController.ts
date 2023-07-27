import {getUsersRepository} from '../repositories/repos'
import {AsyncRouteWrapper} from '../exceptions/exceptions'
import {getUser, HTTP_STATUS, sendResponse} from '../util/endpoint-util'
import type {Request, Response} from 'express'
import { Router } from 'express'
export const LogoutController: Router = Router()

const usersRepository = getUsersRepository()

LogoutController.post('/', AsyncRouteWrapper(async (request: Request, response: Response) => {
  try {
    const user = getUser(request)

    const res = await usersRepository.deleteTokensByUserId(user._id)

    sendResponse(response, HTTP_STATUS.OK, { message: 'Logged out successfully' })
  } catch (e) {
    sendResponse(response, HTTP_STATUS.INTERNAL_SERVER)
  }
}))