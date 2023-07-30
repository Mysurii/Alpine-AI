import type { Request, Response } from 'express'
import UserService from './user.service'
import ValidationError from '@common/helpers/errors/validation.error'
import NotFound from '@common/helpers/errors/notFound'

class UserController {
  private userService: UserService

  constructor() {
    this.userService = new UserService()
  }

  async find(req: Request, res: Response) {
    const { id } = req.body

    if (!id && typeof id !== 'string') throw new ValidationError('Please provide an userId')

    const user = await this.userService.findById(id)

    if (!user) {
      throw new NotFound('User does not exist.')
    }

    return res.json(user)
  }
}

export default new UserController()
