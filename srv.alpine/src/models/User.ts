import type { LoginRequest, Tokens, Role } from '../types/account'
import type { BaseEntity } from './BaseEntity'
import type { Customization } from './Customization'

export type User = BaseEntity &
  LoginRequest & {
    name: string
    role: Role
    tokens: Tokens
    customization: Customization
  }
