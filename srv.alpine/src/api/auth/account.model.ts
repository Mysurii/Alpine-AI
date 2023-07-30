import { BaseModel } from '@common/interfaces/base-model'
import { LoginRequest, Tokens } from './types/loginRequest'
import { Role } from '@common/interfaces/base-model'

type Account = BaseModel &
  LoginRequest & {
    _id: string
    name: string
    role: Role
    verified: boolean
    verificationCode: string
    tokens: Tokens | null
  }

export default Account
