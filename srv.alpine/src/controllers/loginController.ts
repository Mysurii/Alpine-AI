import type { Request, Response} from 'express'
import { Router } from 'express'
import { ApiErrorResponse, ApiException, AsyncRouteWrapper, INSECURE_PASSWORD, INVALID_EMAIL, INVALID_PASSWORD, INVALID_VALUE, MISSING_BODY, NOT_FOUND, WRONG_CREDENTIALS } from '../exceptions/exceptions'
import type { Account, CreateAccount, LoginRequest, RefreshedTokens, SuccessLogin, TokenPayload } from '../models/authentication'
import { createAccessToken, createRefreshToken, generateVerificationCode, hashPassword, samePassword } from '../util/util'
import { env_variables } from '../config'
import { getUsersRepository } from '../repositories/repos'
import type { JsonWebTokenError, JwtPayload } from 'jsonwebtoken'
import jwt from 'jsonwebtoken'
import validator from 'validator'
import { loginRateLimiter } from '../middlewares/rateLimitMiddleware'
import type { BodyAttribute, MessageResponse} from '../util/endpoint-util'
import { getUser} from '../util/endpoint-util'
import { HTTP_STATUS, bodyAttributesCheck, sendResponse } from '../util/endpoint-util'
import { sendResetPasswordMail, sendVerificationMail } from '../util/mailer'

export const LoginController: Router = Router()

const usersRepository = getUsersRepository()

// login
LoginController.post('/', loginRateLimiter, AsyncRouteWrapper(async (request: Request, response: Response) => {
  const { email, password }: LoginRequest = request.body

  if (typeof email === 'undefined' || typeof password === 'undefined') {
    throw MISSING_BODY('Email and password are required')
  }

  const user = await usersRepository.getUserByEmail(email, { role: 1, password: 1, tokens: 1, name: 1 })

  if (user == null) {
    throw NOT_FOUND('User with the given email not found')
  }

  const correctPassword = await samePassword(password, user.password)

  if (!correctPassword) {
    throw WRONG_CREDENTIALS()
  }

  let accessToken: string, refreshToken: string

  let newTokens = true

  if (typeof user.tokens !== 'undefined') {
    try {
      jwt.verify(user.tokens.accessToken, env_variables.TOKENS.secret)
      jwt.verify(user.tokens.refreshToken, env_variables.TOKENS.secret)

      accessToken = user.tokens.accessToken
      refreshToken = user.tokens.refreshToken

      newTokens = false
    } catch (error) {
      accessToken = createAccessToken(user)
      refreshToken = createRefreshToken(user)
    }
  } else {
    accessToken = createAccessToken(user)
    refreshToken = createRefreshToken(user)
  }

  if (newTokens) {
    const success = await usersRepository.storeTokensByUserId(user._id, { accessToken, refreshToken })

    if (!success) {
      throw new ApiErrorResponse('Something went wrong with storing the tokens', HTTP_STATUS.BAD)
    }
  }

  const tokens: SuccessLogin = {
    accessToken,
    refreshToken,
    role: user.role,
    name: user.name
  }

  sendResponse(response, HTTP_STATUS.OK, tokens)
}))

// refresh tokens
LoginController.post('/refresh', AsyncRouteWrapper(async (request: Request, response: Response) => {
  const requiredAttributes: Array<BodyAttribute> = [
    { name: 'refreshToken', type: 'string' }
  ]

  bodyAttributesCheck(request.body, requiredAttributes)

  const { refreshToken } = request.body as Omit<RefreshedTokens, 'accessToken'>

  try {
    const { _id: userId, type, exp } = jwt.verify(refreshToken, env_variables.TOKENS.secret) as JwtPayload & TokenPayload

    if (type !== 'rt') {
      throw new ApiErrorResponse('Token needs to be refresh token', HTTP_STATUS.BAD)
    }

    const user = await usersRepository.getUserById(userId, { _id: 1, tokens: 1, role: 1 })
    
    if (user == null) {
      throw NOT_FOUND('User linked to the refresh token not found')
    }
    
    if (user.tokens.refreshToken !== refreshToken) {
      throw new ApiErrorResponse('Refresh token is not valid', HTTP_STATUS.BAD)
    }

    let accessToken = user.tokens.accessToken

    // check if access token is expired
    const decodedAt = jwt.decode(accessToken) as JwtPayload

    if (Date.now() >= decodedAt.exp! * 1000) {
      // access token is expired, generate new one
      accessToken = createAccessToken(user)

    }

    // always generate new refresh token
    const newRefreshToken = createRefreshToken(user)
    
    const tokens: RefreshedTokens = {
      accessToken,
      refreshToken: newRefreshToken
    }


    // refresh token is still valid or else an exception was thrown
    const success = await usersRepository.storeTokensByUserId(user._id, tokens)

    sendResponse(response, HTTP_STATUS.OK, tokens)
  } catch (err: unknown) {
    if (err instanceof ApiErrorResponse) {
      throw err
    }

    const error = err as JsonWebTokenError
    const message = error.message === 'jwt malformed' ? 'Refresh token invalid' : 'Refresh token expired'

    // invalid/expired refresh token
    throw new ApiErrorResponse(message, HTTP_STATUS.BAD)
  }
}))

// change password
LoginController.put('/password', AsyncRouteWrapper(async (request: Request, response: Response) => {
  const user = getUser(request)
  // user is authenticated so the body requires the old and new password

  const requiredAttributes: Array<BodyAttribute> = [
    { name: 'oldPassword', type: 'string', optional: true },
    { name: 'verificationCode', type: 'string', optional: true },
    { name: 'password', type: 'string' }
  ]

  bodyAttributesCheck(request.body, requiredAttributes)

  const { oldPassword, password, verificationCode } = request.body as { oldPassword?: string, verificationCode?: string, password: string }

  if (typeof oldPassword === 'undefined' && typeof verificationCode === 'undefined') {
    throw MISSING_BODY('Old password or verification code is required')
  }

  // check if new password is strong enough
  if (!validator.isStrongPassword(password)) {
    throw INSECURE_PASSWORD()
  }

  // retrieve the user
  const dbUser = await usersRepository.getUserById(user._id, { _id: 1, password: 1, role: 1, verificationCode: 1 })

  if (dbUser == null) {
    throw NOT_FOUND('User not found')
  }

  if (typeof oldPassword !== 'undefined') {
    // compare user old password input with the saved password
    const correctPassword = await samePassword(oldPassword, dbUser?.password)

    if (!correctPassword) {
      throw INVALID_PASSWORD()
    }
  } else {
    // check verification code

    if (typeof verificationCode === 'undefined') {
      throw MISSING_BODY('Verification code not set')
    }

    if (dbUser.verificationCode !== verificationCode) {
      throw MISSING_BODY('Verification code not valid')
    }
  }

  // store new password

  const hashedPassword = await hashPassword(password)

  await usersRepository.updatePasswordById(dbUser._id, hashedPassword)

  // clear the tokens
  await usersRepository.storeTokensByUserId(dbUser._id)
  // clear verificationCode
  await usersRepository.updateVerifiedStatusById(dbUser._id)

  sendResponse(response, HTTP_STATUS.NO_CONTENT)
}))

// reset password
LoginController.put('/reset-password', AsyncRouteWrapper(async (request: Request, response: Response) => {
  const requiredAttributes: Array<BodyAttribute> = [
    { name: 'email', type: 'string' }
  ]

  bodyAttributesCheck(request.body, requiredAttributes)

  const { email } = request.body as { email: string }

  if (!validator.isEmail(email)) {
    throw INVALID_EMAIL()
  }

  const dbResponse = await usersRepository.getUserByEmail(email, { _id: 1, email: 1, role: 1, name: 1 })

  // if the user exists, send email
  if (dbResponse != null) {
    const verificationCode = generateVerificationCode()
    const tempAccessToken = createAccessToken({ role: dbResponse.role, _id: dbResponse._id })

    await usersRepository.storeTempAccessTokenByUserId(dbResponse._id, tempAccessToken)
    await usersRepository.storeVerificationCode(dbResponse._id, verificationCode)

    await sendResetPasswordMail(dbResponse.name, dbResponse.email, tempAccessToken, verificationCode)
  }

  const resMessage: MessageResponse = {
    message: 'If the email exists an email will be send with instructions'
  }

  return sendResponse(response, HTTP_STATUS.ACCEPTED, resMessage)
}))

LoginController.post('/create', AsyncRouteWrapper(async (request: Request, response: Response) => {
  const { tempAccessToken } = await createAccount(request.body)

  sendResponse(response, HTTP_STATUS.CREATED, { accessToken: tempAccessToken })
}))

LoginController.post('/verify', AsyncRouteWrapper(async (request: Request, response: Response) => {
  const requiredAttributes: Array<BodyAttribute> = [
    { name: 'verificationCode', type: 'string' }
  ]

  bodyAttributesCheck(request.body, requiredAttributes)

  const { verificationCode } = request.body
  const user = getUser(request)

  // check if verificationCode is valid

  const retrievedUser = await usersRepository.getUserById(user._id, { verificationCode: 1, role: 1 })

  if (retrievedUser == null) {
    throw NOT_FOUND('User not found')
  }

  if (retrievedUser.verificationCode !== verificationCode) {
    throw INVALID_VALUE('Verification code not valid')
  }

  // code is valid
  // update the user in the database
  const dbResponse = await usersRepository.updateVerifiedStatusById(retrievedUser._id)

  if (!dbResponse.acknowledged) {
    throw new ApiErrorResponse('Something went wrong with updating the user', HTTP_STATUS.INTERNAL_SERVER)
  }

  const partialUserObject: Pick<Account, '_id' | 'role'> = {
    _id: retrievedUser._id.toString(),
    role: retrievedUser.role
  }

  const tokens: Account['tokens'] = {
    accessToken: createAccessToken(partialUserObject),
    refreshToken: createRefreshToken(partialUserObject)
  }

  const tokensDbResponse = await usersRepository.storeTokensByUserId(retrievedUser._id, tokens)

  if (!tokensDbResponse) {
    throw new ApiErrorResponse('Something went wrong with storing the tokens', HTTP_STATUS.BAD)
  }

  sendResponse(response, HTTP_STATUS.CREATED, { role: retrievedUser.role, ...tokens })
}))

export async function createAccount(requestBody: NonNullable<Record<string, never>>, userid?: string) {
  const requiredAttributes: Array<BodyAttribute> = [
    { name: 'email', type: 'string' },
    { name: 'password', type: 'string' },
    { name: 'name', type: 'string' }
  ]

  bodyAttributesCheck(requestBody, requiredAttributes)

  const { email, password, name, role } = requestBody

  // check if email is valid
  if (!validator.isEmail(email)) {
    throw INVALID_EMAIL()
  }

  // check if the password is strong
  // default: minLength=8, minLowercase=1, minUppercase=1, minNumbers=1, minSymbols=1
  if (!validator.isStrongPassword(password)) {
    throw INSECURE_PASSWORD()
  }

  // check if email is already in use
  const existingEmail = await usersRepository.getUserByEmail(email, { _id: 1, email: 1 })

  if (existingEmail != null) {
    throw new ApiErrorResponse('Email already in use', { code: 409, status: 'CONFLICT' })
  }

  const newAccount: Required<CreateAccount> & { verified: Account['verified'] } = {
    email, name,
    password: await hashPassword(password),
    role: 'user',
    verified: false,
    verificationCode: generateVerificationCode()
  }

  if (typeof userid !== 'undefined') {
    const currentUser = await usersRepository.getUserById(userid, { _id: 0, role: 1 })

    if (currentUser == null) {
      throw NOT_FOUND('Current user not found')
    }

    // if the current user is an admin and the specified role is equal to admin, create an admin account
    if (typeof role !== 'undefined' && currentUser.role === 'admin' && role === 'admin') {
      newAccount.role = 'admin'
    }
  }

  let tempAccessToken: Account['tokens']['accessToken']

  try {
    const { insertedId: userid, acknowledged } = await usersRepository.storeUser(newAccount)

    if (!acknowledged) {
      throw new ApiErrorResponse('Something went wrong with creating the user', HTTP_STATUS.BAD)
    }

    const partialUserObject: Pick<Account, '_id' | 'role'> = {
      _id: userid.toString(),
      role: newAccount.role
    }

    tempAccessToken = createAccessToken(partialUserObject)

    const success = await usersRepository.storeTempAccessTokenByUserId(partialUserObject._id, tempAccessToken)

    if (!success) {
      throw new ApiErrorResponse('Something went wrong with storing the tokens', HTTP_STATUS.BAD)
    }
  } catch (e) {
    throw new ApiException('Something went wrong with creating the new user', e as Error)
  }

  // send verification email
  await sendVerificationMail(newAccount.name, newAccount.email, newAccount.verificationCode)

  return { newAccount, tempAccessToken }
}