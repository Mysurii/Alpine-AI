export type Role = 'user' | 'admin'

export type Tokens = {
  access: string
  refresh: string
}

export type LoginRequest = {
  email: string
  password: string
}

export type TokenPayload = {
  _id: string
  role: Role
  type: 'rt' | 'at'
}
