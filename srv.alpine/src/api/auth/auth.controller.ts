import { NextFunction, Request, Response } from 'express'
import AuthService from './auth.service'
import ValidationError from '@common/helpers/errors/validation.error'
import NotFound from '@common/helpers/errors/notFound'
import { SuccessLogin, Tokens } from './types/loginRequest'
import { RouteWrapper } from '@common/helpers/route-wrapper'
import { JwtPayload } from 'jsonwebtoken'

class AuthController {
  private authService: AuthService = new AuthService()

  register = RouteWrapper(async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, password } = req.body

    await this.authService.createUser({ name, email, password })

    return res.status(204).json()
  })

  login = RouteWrapper(async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body

    const user = await this.authService.findUser(email)

    if (!user) throw new NotFound('User does not exist.')

    const isPasswordMatching = this.authService.isPasswordMatching(user, password)
    if (!isPasswordMatching) throw new ValidationError('Invalid credentials.')

    const tokens = this.authService.generateTokens({
      _id: user._id,
      role: user.role,
    })

    user.tokens = tokens

    await this.authService.updateUser(user)

    const successLogin = {
      name: user.name,
      role: user.role,
      tokens,
    } satisfies SuccessLogin

    return res.status(200).json({ data: successLogin })
  })

  refresh = RouteWrapper(async (req: Request, res: Response, next: NextFunction) => {
    const { refreshToken } = req.body as Pick<Tokens, 'refreshToken'>

    const { _id, role } = this.authService.verifyToken(refreshToken, 'rt') as JwtPayload

    const { accessToken } = this.authService.generateTokens({ _id, role })

    return res.json({ accessToken })
  })

  test = RouteWrapper(async (req: Request, res: Response, next: NextFunction) => {
    console.log('user:', req.user)
    return res.json({ Hellow: 'World' })
  })
}

export default new AuthController()
