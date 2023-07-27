import { ObjectID } from 'bson'
import { sign } from 'jsonwebtoken'
import { ObjectId } from 'mongodb'
import { env_variables } from '../config'
import { INVALID_ID } from '../exceptions/exceptions'
import type { Account, TokenPayload } from '../models/authentication'
import { hash as passwordHasher, compare as passwordCompare } from 'bcrypt'
import validator from 'validator'
import crypto from 'crypto'

type TokensPayload = Pick<Account, '_id' | 'role'>

export function createAccessToken(account: TokensPayload): string {
  return createToken(account, env_variables.TOKENS.atExpiration, 'at')
}

export function createRefreshToken(account: TokensPayload): string {
  return createToken(account, env_variables.TOKENS.rtExpiration, 'rt')
}

export function hashPassword(password: string) {
  const SALT_ROUNDS = 10
  return passwordHasher(password, SALT_ROUNDS)
}

export function samePassword(inputPassword: string, encryptedPassword: string) {
  return passwordCompare(inputPassword, encryptedPassword)
}

function createToken(account: TokensPayload, expiration: number|string, type: TokenPayload['type']): string {
  return sign({ _id: account._id, role: account.role, type },
    env_variables.TOKENS.secret,
    { expiresIn: expiration }
  )
}

export function generateVerificationCode(): string {
  return crypto
    .randomBytes(5)
    .toString('hex')
}

export function generateId(): ObjectID | string {
  if (env_variables.ID_TYPE === 'ObjectID') {
    return new ObjectID()
  } else {
    return crypto.randomUUID()
  }
}

export function isValidId(id: ObjectId | string): boolean {
  if (env_variables.ID_TYPE === 'ObjectID') {
    return ObjectID.isValid(id)
  } else {
    return !(id instanceof ObjectID) && validator.isUUID(id)
  }
}

export function parseId(id: ObjectID | string): ObjectID | string {
  if (env_variables.ID_TYPE === 'ObjectID') {
    if (id instanceof ObjectId) return id

    return new ObjectId(id)
  } else {
    // check if UUID
    if (id instanceof ObjectID || !validator.isUUID(id)) {
      throw INVALID_ID()
    }
  }

  return id
}

export function getBoolean (value: string | boolean | number): boolean | undefined {
  if (typeof value === 'string') {
    if (value === 'true' || value === 'false') {
      return value === 'true'
    } else {
      throw Error('Value not of type boolean')
    }
  } else if (typeof value === 'number') {
    return value > 0 // 0 = false, greater than 0 = true
  } else if (typeof value === 'boolean') {
    return value
  }
}

export function generatePublicPrivateKey() {
  return crypto.generateKeyPairSync('rsa', {
    // The standard secure default length for RSA keys is 2048 bits
    modulusLength: 2048,
    publicKeyEncoding: {
      type: 'spki',       // recommended to be 'spki' by the Node.js docs
      format: 'pem'
    },
    privateKeyEncoding: {
      type: 'pkcs8',      // recommended to be 'pkcs8' by the Node.js docs
      format: 'pem'
    }
  })
}

export function encryptData(publicKey: string, data: string, returnType: 'buffer'): Buffer
export function encryptData(publicKey: string, data: string, returnType: 'string'): string
export function encryptData(publicKey: string, data: string, returnType: 'string'|'buffer' = 'buffer') {
  const buffer = crypto.publicEncrypt({
    key: publicKey,
    oaepHash: 'sha256'
  },
  Buffer.from(data))

  if (returnType === 'string') {
    return buffer.toString('base64')
  }

  return buffer
}

export function decryptData(privateKey: string, encrypted: string, encoding: BufferEncoding): string
export function decryptData(privateKey: string, encrypted: NodeJS.ArrayBufferView): string
export function decryptData(privateKey: string, encrypted: string|NodeJS.ArrayBufferView, encoding: BufferEncoding = 'base64'): string {
  if (typeof encrypted === 'string') {
    encrypted = Buffer.from(encrypted, encoding)
  }

  return crypto.privateDecrypt({
    key: privateKey,
    oaepHash: 'sha256'
  }, encrypted).toString()
}

export function isBase64(str: string) {
  try {
    return Buffer.from(str, 'base64').toString('base64') === str
  } catch (err) {
    return false
  }
}