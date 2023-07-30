import { Role } from '@common/interfaces/base-model'
import Account from '../account.model'

export type LoginRequest = {
  email: string
  password: string
}

export type Tokens = {
  accessToken: string
  refreshToken: string
}

export type TokenPayload = {
  _id: Account['_id']
  role: Account['role']
  type: TokenType
}

export type SuccessLogin = {
  role: Role
  name: string
  tokens: Tokens
}

export type TokenType = 'at' | 'rt'
