import type { LoginRequest, Tokens, Role } from '../types/account'
import type { BaseEntity } from './BaseEntity'

export type User = BaseEntity &
  LoginRequest & {
    name: string
    role: Role
    verified: boolean
    verificationCode: string
    tokens: Tokens
  }
