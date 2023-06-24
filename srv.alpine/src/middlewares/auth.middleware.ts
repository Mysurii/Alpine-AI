import { envVariables } from '../config/config'
import { _routes } from './../routes/index'
import { ApiError } from '../helpers/exceptions'
import type { User } from '../models/User'
import type { NextFunction, Request, Response } from 'express'
import type { JwtPayload } from 'jsonwebtoken'
import type { TokenPayload } from '../types/account'
import { getUserRepository } from './../repositories/index'
import { sendError } from '../helpers/endpoint-utils'
import { JsonWebTokenError, verify } from 'jsonwebtoken'
import { HTTP_STATUS } from '../types/http'

type methods = 'GET' | 'POST' | 'DELETE' | 'HEAD' | 'PUT' | '*'

type EndpointSpecifier = {
  endpoint: RegExp | string
  methods: Array<methods>
}

type RoleSpecificEndpoint = Pick<EndpointSpecifier, 'endpoint'> & {
  role: User['role']
  methods: EndpointSpecifier['methods']
}

const excludedEndpoints: Array<EndpointSpecifier> = [
  { endpoint: new RegExp('.*'), methods: ['HEAD'] }, // allow all head requests
  { endpoint: '/api/auth/register', methods: ['POST'] }, // creating a user
  { endpoint: '/api/auth/login', methods: ['POST'] }, // logging in doesn't require access tokens
  { endpoint: '/api/auth/refresh', methods: ['POST'] }, // refreshing tokens don't require access tokens
  { endpoint: '/api/products', methods: ['GET'] },
]

const roleSpecificEndpoints: Array<RoleSpecificEndpoint> = [
  { endpoint: '/api/products', role: 'admin', methods: ['DELETE', 'PUT', 'POST'] },
]

const userRepository = getUserRepository()

export default function authorizationMiddleware(request: Request, response: Response, next: NextFunction) {
  const found = _routes.find(([route]) => request.url.includes(route))

  if (typeof found === 'undefined') {
    return sendError(response, HTTP_STATUS.NOT_FOUND, 'Endpoint does not exist')
  }

  // if requested url is in the excluded auth endpoints, continue the request chain
  if (
    excludedEndpoints.find((e) => {
      if (typeof e.endpoint === 'string') {
        return e.endpoint === request.url && e.methods.includes(request.method as methods)
      }

      return e.methods.includes(request.method as methods) && e.endpoint.test(request.url)
    })
  ) {
    return next()
  }

  // check if tokens are set and valid
  let accessToken: string | undefined

  const authorizationHeader = request.header('Authorization')
  if (authorizationHeader) {
    // Authorization header should have the following structure: Authorization: Bearer {access token}
    if (authorizationHeader.includes('Bearer ')) {
      accessToken = authorizationHeader.split('Bearer ').pop()
    } else {
      return sendError(response, HTTP_STATUS.UNAUTHORIZED, 'Invalid Authorization header')
    }
  } else {
    accessToken = request.query.accessToken as string | undefined
  }

  if (!accessToken) {
    return sendError(response, HTTP_STATUS.UNAUTHORIZED, 'No access token set')
  }

  // verify given access token
  verify(accessToken, envVariables.TOKENS.secret, async (error, payload) => {
    if (error) {
      const mssg: string = error instanceof JsonWebTokenError ? 'Access token is invalid' : 'Access token has expired'

      return sendError(response, HTTP_STATUS.UNAUTHORIZED, mssg)
    }

    const { _id } = payload as JwtPayload & TokenPayload

    if (!_id) {
      return sendError(response, HTTP_STATUS.UNAUTHORIZED, 'User id not set')
    }

    let user: User | null

    try {
      // check if user from who the token is (still) exists
      user = await userRepository.findById(_id)
    } catch (error) {
      const excpetion = new ApiError('Something went wrong with retrieving the user', HTTP_STATUS.INTERNAL_SERVER)
      return sendError(response, excpetion.status, excpetion.message)
    }

    if (!user) {
      return sendError(response, HTTP_STATUS.BAD_REQUEST, 'User does not exist')
    }

    // check if the user is authorized for the endpoint

    const requestedEndpoint = request.url

    for (const { endpoint, methods, role } of roleSpecificEndpoints) {
      const includesEndpoint =
        typeof endpoint === 'string' ? requestedEndpoint.includes(endpoint) : endpoint.test(requestedEndpoint)

      const cantEnter =
        includesEndpoint && role !== user.role && (methods.includes('*') || methods.includes(request.method as methods))

      if (cantEnter) {
        return sendError(response, HTTP_STATUS.UNAUTHORIZED, 'Insufficient rights to this endpoint')
      }
    }

    request.user = {
      _id: _id,
      role: user.role,
    }

    return next()
  })
}
