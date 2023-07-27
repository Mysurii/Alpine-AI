import type { Request, Response, NextFunction } from 'express'
import type { JwtPayload} from 'jsonwebtoken'
import { JsonWebTokenError, verify } from 'jsonwebtoken'
import {awaitDatabaseConnection, env_variables} from '../config'
import {ApiErrorResponse, ApiException} from '../exceptions/exceptions'
import type { Account, TokenPayload } from '../models/authentication'
import { getUsersRepository } from '../repositories/repos'
import { _routes } from '../routes'
import {HTTP_STATUS, sendError, sendResponse} from '../util/endpoint-util'
import {decryptData, isBase64} from '../util/util'

type methods = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'HEAD' | 'PATCH' | '*'

type EndpointSpecifier = {
  endpoint: RegExp | string,
  methods: Array<methods>
}

type RoleSpecificEndpoint = Pick<EndpointSpecifier, 'endpoint' | 'methods'> & { 
  role: Account['role']
}

const excludedEndpoints: Array<EndpointSpecifier> = [
  { endpoint: new RegExp('.*'), methods: [ 'HEAD' ] }, // allow all head requests
  { endpoint: '/login/create', methods: [ 'POST' ] }, // creating a user
  { endpoint: '/login', methods: [ 'POST' ] }, // logging in doesn't require access tokens
  { endpoint: '/login/reset-password', methods: [ 'PUT' ] },
  { endpoint: '/login/refresh', methods: [ 'POST' ] } // refreshing tokens don't require access tokens
]

const roleSpecificEndpoints: Array<RoleSpecificEndpoint> = []

const userRepository = getUsersRepository()

export default function authorizationMiddleware(request: Request, response: Response, next: NextFunction) {
  const found = _routes.find(([route]) => request.url.includes(route))
  
  if (typeof found === 'undefined') {
    return sendError(response, HTTP_STATUS.NOT_FOUND, 'Endpoint does not exist')
  }

  // if requested url is in the excluded auth endpoints, continue the request chain
  if (excludedEndpoints.find(e => {
    if (typeof e.endpoint === 'string') {
      return e.endpoint === request.url && e.methods.includes(request.method as methods)
    }

    // regex operation is more expensive than array includes
    return e.methods.includes(request.method as methods) && e.endpoint.test(request.url)
    
  })) {
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

  if (isBase64(accessToken)) {
    // can only access /chatbots/response with encrypted key
    if (request.url !== '/chatbots/response') {
      return sendError(response, HTTP_STATUS.UNAUTHORIZED, 'Invalid access token')
    }
    try {
      const decryptedDataStr = decryptData(env_variables.ENCRYPTION_KEYS.PRIVATE, accessToken, 'base64')
      const parsedData = JSON.parse(decryptedDataStr) as { userId: string }
      
      if (typeof parsedData?.userId === 'undefined') {
        return sendError(response, HTTP_STATUS.UNAUTHORIZED, 'Invalid access token')
      }

      validateUser(parsedData?.userId).then(({ role }) => {
        request.encryptedToken = { user: { role, _id: parsedData.userId }, ...parsedData }
        // return sendResponse(response, HTTP_STATUS.OK, decryptedDataStr)
        return next()
      }).catch(error => {
        if (error instanceof ApiErrorResponse) {
          return sendError(response, error.status, error.message)
        }

        return sendError(response, HTTP_STATUS.INTERNAL_SERVER, 'Internal server error')
      })
    } catch (e) {
      return sendError(response, HTTP_STATUS.UNAUTHORIZED, 'Invalid access token')
    }
  } else {
    // verify given access token
    verify(accessToken, env_variables.TOKENS.secret, async (error, payload) => {
      if (error) {
        const mssg: string = error instanceof JsonWebTokenError ?
          'Access token is invalid' : 'Access token has expired'

        return sendError(response, HTTP_STATUS.UNAUTHORIZED, mssg)
      }

      const { _id } = payload as JwtPayload & TokenPayload

      if (!_id || !accessToken) {
        return sendError(response, HTTP_STATUS.UNAUTHORIZED, 'User id not set')
      }

      // check in the database if the accessToken is still valid
      const validAccessToken = await userRepository.isAccessTokenValid(_id, accessToken)

      if (!validAccessToken) {
        return sendError(response, HTTP_STATUS.UNAUTHORIZED, 'Access token is invalid')
      }

      // check if the user has the required role to access the endpoint
      try {
        const validatedUser = await validateUser(_id)

        request.user = {
          _id: _id,
          role: validatedUser.role
        }

        return next()
      } catch (e) {
        if (e instanceof ApiErrorResponse) {
          return sendError(response, e.status, e.message)
        }

        return sendError(response, HTTP_STATUS.INTERNAL_SERVER, 'Internal server error')
      }

    })
  }
  async function validateUser(_id: Account['_id']): Promise<Account> {
    let user: Account | null

    try {
      // check if user from who the token is (still) exists
      user = await userRepository.getUserById(_id, { _id: 0, role: 1, verified: 1 })
    } catch (error) {
      throw new ApiException('Something went wrong with retrieving the user', error as Error)
    }

    if (!user) {
      throw new ApiErrorResponse('User does not exist', HTTP_STATUS.BAD)
    }

    if (user.verified === false && !request.url.includes('verify')) {
      throw new ApiErrorResponse('User is not verified', HTTP_STATUS.BAD)
    }

    // check if the user is authorized for the endpoint

    const requestedEndpoint = request.url

    for (const { endpoint, methods, role } of roleSpecificEndpoints) {
      const includesEndpoint = typeof endpoint === 'string' ?
        requestedEndpoint.includes(endpoint) :
        endpoint.test(requestedEndpoint)

      const cantEnter = includesEndpoint &&
          role !== user.role &&
          (methods.includes('*') || methods.includes(request.method as methods))

      if (cantEnter) {
        throw new ApiErrorResponse('User is not authorized for this endpoint', HTTP_STATUS.UNAUTHORIZED)
      }
    }

    return user
  }
  
}

