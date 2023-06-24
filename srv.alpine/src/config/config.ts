import type { Db } from 'mongodb'
import { MongoClient } from 'mongodb'

const {
  ACCESS_TOKEN_EXPIRATION,
  AI_SERVER_URL,
  DATABASE_URL,
  DATABASE_NAME,
  JWT_SECRET,
  PORT,
  PRIVATE_KEY,
  PUBLIC_KEY,
  REFRESH_TOKEN_EXPIRATION,
} = process.env

if (
  typeof ACCESS_TOKEN_EXPIRATION === 'undefined' ||
  typeof REFRESH_TOKEN_EXPIRATION === 'undefined' ||
  typeof JWT_SECRET === 'undefined'
) {
  throw Error('Token variables are not set!')
}

if (typeof DATABASE_URL === 'undefined' || typeof DATABASE_NAME === 'undefined') {
  throw Error('Database URL is not set.')
}

if (typeof AI_SERVER_URL === 'undefined') {
  throw Error('No connection url with the AI server provided!')
}

if (typeof PRIVATE_KEY === 'undefined' || typeof PUBLIC_KEY === 'undefined') {
  throw Error('Public and private key are not set.')
}

type EnvVariables = {
  AI_SERVER_URL: string
  DATABASE: {
    url: string
    name: string
  }
  ENCRYPTION_KEYS: { public: string; private: string }
  PORT: number
  TOKENS: { secret: string; atExpiration: number; RtExpiration: number }
}

export const envVariables: EnvVariables = {
  AI_SERVER_URL,
  DATABASE: {
    url: DATABASE_URL,
    name: DATABASE_NAME,
  },
  ENCRYPTION_KEYS: {
    public: PUBLIC_KEY,
    private: PRIVATE_KEY,
  },
  PORT: PORT ? parseInt(PORT) : 8000,
  TOKENS: {
    secret: JWT_SECRET,
    atExpiration: parseInt(ACCESS_TOKEN_EXPIRATION),
    RtExpiration: parseInt(REFRESH_TOKEN_EXPIRATION),
  },
}
