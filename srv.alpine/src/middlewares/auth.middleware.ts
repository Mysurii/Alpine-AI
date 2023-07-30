import Account from '@api/auth/account.model'
import AuthService from '@api/auth/auth.service'
import BadRequest from '@common/helpers/errors/badrequest'
import NotFound from '@common/helpers/errors/notFound'
import { RouteWrapper } from '@common/helpers/route-wrapper'
import app from 'app'
import type { Request, Response, NextFunction } from 'express'
import { JwtPayload } from 'jsonwebtoken'

type methods = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'HEAD' | 'PATCH' | '*'

const excludedEndpoints: Array<string> = ['/api/auth/signup', '/api/auth/signin', '/api/auth/refresh']
const adminEndpoints: Array<string> = []

const authService = new AuthService()

const authMiddleware = RouteWrapper(async (req: Request, res: Response, next: NextFunction) => {
  const isPublicRoute = excludedEndpoints.includes(req.originalUrl)

  if (isPublicRoute) {
    console.log('public route!')
    return next()
  }

  const authorizationHeader = req.header('Authorization')

  if (!authorizationHeader || !authorizationHeader.includes('Bearer ')) throw new BadRequest('Invalid Authorization header')

  const accessToken = authorizationHeader.split('Bearer ').pop()

  if (!accessToken) throw new BadRequest('You are not logged in!')

  const { _id } = authService.verifyToken(accessToken, 'at') as JwtPayload

  const user = await authService.findById(_id)

  if (!user) throw new NotFound('User does not exist.')

  req.user = user

  return next()
})

export default authMiddleware
