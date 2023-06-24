import type { User } from './../models/User'
import { sign } from 'jsonwebtoken'
import { envVariables } from '../config/config'

type TokensPayload = Pick<User, '_id' | 'role'>
type TokenPayload = 'rt' | 'at'

export function createAccessToken(account: TokensPayload): string {
  return createToken(account, envVariables.TOKENS.atExpiration, 'at')
}

export function createRefreshToken(account: TokensPayload): string {
  return createToken(account, envVariables.TOKENS.rtExpiration, 'rt')
}

function createToken(account: TokensPayload, expiration: number | string, type: TokenPayload): string {
  return sign({ _id: account._id, role: account.role, type }, envVariables.TOKENS.secret, { expiresIn: expiration })
}
