import type { ObjectID } from 'bson'

export type Role = 'user' | 'admin'
export type ID = ObjectID | string

export type SuccessLogin = RefreshedTokens & {
  role: Role,
  name: string
}

export type RefreshedTokens = {
  accessToken: Account['tokens']['accessToken'],
  refreshToken: Account['tokens']['refreshToken'],
}

export type LoginRequest = {
  email: string,
  password: string
}

export type Account = LoginRequest & {
  _id: ID,
  name: string,
  role: Role,
  verified: boolean,
  verificationCode: string,
  tokens: {
    accessToken: string,
    refreshToken: string,
  }
}

export type CreateAccount = Omit<Account, '_id' | 'role' | 'tokens' | 'cart' | 'verified' | 'verificationCode'> & {
  role?: Account['role'],
  verificationCode?: Account['verificationCode']
}

export type TokenPayload = {
  _id: Account['_id'],
  role: Account['role'],
  type: 'rt' | 'at'
}