import type { Request, Response } from 'express'
import type { User } from '../models/User'

import jwt from 'jsonwebtoken'
import validator from 'validator'
import { Router } from 'express'
import { compare, hash } from 'bcrypt'

import UserRepository from '../repositories/user.repository'
import { sendResponse, sendError } from '../helpers/endpoint-utils'
import Logger from '../config/Logger'
import { envVariables } from '../config/config'
import { HTTP_STATUS } from '../types/http'
import { createAccessToken, createRefreshToken } from '../helpers/jwt'
import ChatbotRepository from '../repositories/chatbot.respository'

const userController = Router()
const userRepository = new UserRepository()
const chatbotRepository = new ChatbotRepository()

userController.post('/register', async (req: Request, res: Response) => {
  const { email, password, name } = req.body

  if (!email || !password || !name)
    return sendError(res, HTTP_STATUS.BAD_REQUEST, 'Please provide all the fields required')

  if (!validator.isEmail(email)) return sendError(res, HTTP_STATUS.BAD_REQUEST, 'Email is not valid')

  // default: minLength=8, minLowercase=1, minUppercase=1, minNumbers=1, minSymbols=1
  if (!validator.isStrongPassword(password))
    return sendError(res, HTTP_STATUS.BAD_REQUEST, 'Password not strong enough')

  const emailExists = await userRepository.findByEmail(email)

  if (emailExists) return sendError(res, HTTP_STATUS.BAD_REQUEST, 'Email is already in use')

  const saltRounds = 10

  const newUser: Partial<User> = {
    email,
    name,
    password: await hash(password, saltRounds),
    role: 'user',
  }

  try {
    userRepository.insert(newUser)
    const user = await userRepository.findByEmail(email)
    if (user) chatbotRepository.createBasicChatbot(user._id)
  } catch (err) {
    Logger.error(err)
    return sendError(res, HTTP_STATUS.INTERNAL_SERVER, 'Something went wrong while trying to create accout')
  }

  return sendResponse(res, HTTP_STATUS.OK, { message: 'Successfully created!' })
})

userController.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body

  if (!email || !password)
    return sendError(res, HTTP_STATUS.INTERNAL_SERVER, 'Please provide a valid email and password')

  const user = await userRepository.findByEmail(email)

  if (!user) {
    return sendError(res, HTTP_STATUS.BAD_REQUEST, 'User with the given email not found')
  }

  const isCorrectPassword = await compare(password, user.password)

  if (!isCorrectPassword) return sendError(res, HTTP_STATUS.BAD_REQUEST, 'Invalid credentials')

  let accessToken: string = user.tokens?.access
  let refreshToken: string = user.tokens?.refresh

  let newTokens = true

  if (typeof user.tokens !== 'undefined') {
    try {
      jwt.verify(user.tokens.access, envVariables.TOKENS.secret)
      jwt.verify(user.tokens.refresh, envVariables.TOKENS.secret)

      accessToken = user.tokens.access
      refreshToken = user.tokens.refresh

      newTokens = false
    } catch (err) {
      accessToken = createAccessToken(user)
      refreshToken = createRefreshToken(user)
    }
  } else {
    accessToken = createAccessToken(user)
    refreshToken = createRefreshToken(user)
  }

  if (newTokens) {
    user.tokens = { access: accessToken, refresh: refreshToken }
    const success = await userRepository.update(user._id, user)

    if (!success) {
      return sendError(res, HTTP_STATUS.BAD_REQUEST, 'Something went wrong with storing the tokens')
    }
  }

  const tokens = {
    accessToken,
    refreshToken,
    role: user.role,
    name: user.name,
  }
  sendResponse(res, HTTP_STATUS.OK, tokens)
})

export default userController
