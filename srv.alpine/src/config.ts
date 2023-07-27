import type { Db, MongoClient } from 'mongodb'
import { connect } from 'mongodb-helper'

const {
  PRIVATE_KEY,
  PUBLIC_KEY,
  PORT, ID_TYPE, DATABASE_NAME, DATABASE_CONNECTION_TIMEOUT,
  JWT_SECRET, ACCESS_TOKEN_EXPIRATION, REFRESH_TOKEN_EXPIRATION,
  EMAIL, EMAIL_PASS, EMAIL_SERVICE,
  SITE_BASE_URL,
  AI_SERVER_URL
} = process.env

let { CONSOLE_ERROR_LOGGING, DATABASE_URL } = process.env

if (DATABASE_NAME === undefined || DATABASE_URL === undefined || DATABASE_CONNECTION_TIMEOUT === undefined) {
  throw Error('Database variables not set!')
}

if (JWT_SECRET === undefined || ACCESS_TOKEN_EXPIRATION === undefined || REFRESH_TOKEN_EXPIRATION === undefined) {
  throw Error('Token variables are not set!')
}

if (typeof ID_TYPE === 'undefined' || (ID_TYPE !== 'ObjectID' && ID_TYPE !== 'UUID')) {
  throw Error('ID_TYPE not specified, needs to be \'ObjectID\' or \'UUID\'')
}

if (typeof EMAIL === 'undefined' || typeof EMAIL_PASS === 'undefined' || typeof EMAIL_SERVICE === 'undefined') {
  throw Error('Not all email variables are set')
}

if (typeof SITE_BASE_URL === 'undefined') {
  throw Error('Site base url variable not set')
}

if (typeof AI_SERVER_URL === 'undefined') {
  throw Error('AI server url variable not set')
}

if (typeof CONSOLE_ERROR_LOGGING === 'undefined') {
  CONSOLE_ERROR_LOGGING = 'true'
}

if(typeof PRIVATE_KEY === 'undefined' || typeof PUBLIC_KEY === 'undefined') {
  throw Error('PUBLIC_KEY and or PRIVATE_KEY are not set')
}

type EnvVariables = {
  PORT: number,
  DATABASE: { url: string, name: string, timeout: number },
  TOKENS: { secret: string, atExpiration: number, rtExpiration: number },
  EMAIL: { email: string, pass: string, service: string },
  SITE_BASE_URL: string,
  AI_SERVER_URL: string,
  CONSOLE_ERROR_LOGGING: string,
  ID_TYPE: 'ObjectID' | 'UUID',
  ENCRYPTION_KEYS: { PUBLIC: string, PRIVATE: string }
}

export const env_variables: EnvVariables = {
  PORT: PORT ? parseInt(PORT) : 8080,
  DATABASE: { url: DATABASE_URL, name: DATABASE_NAME, timeout: parseInt(DATABASE_CONNECTION_TIMEOUT) },
  TOKENS: {
    secret: JWT_SECRET,
    atExpiration: parseInt(ACCESS_TOKEN_EXPIRATION),
    rtExpiration: parseInt(REFRESH_TOKEN_EXPIRATION)
  },
  EMAIL: {
    email: EMAIL,
    pass: EMAIL_PASS,
    service: EMAIL_SERVICE
  },
  SITE_BASE_URL,
  AI_SERVER_URL,
  CONSOLE_ERROR_LOGGING,
  ID_TYPE: ID_TYPE as 'ObjectID' | 'UUID',
  ENCRYPTION_KEYS : {PUBLIC: PUBLIC_KEY, PRIVATE: PRIVATE_KEY}
}

let dbUrl: string

if (DATABASE_URL.includes('?')) {
  const split = DATABASE_URL.split('?')
  dbUrl = `${split[0]}/${DATABASE_NAME}?${split[1]}`
} else {
  if (DATABASE_URL.charAt(DATABASE_URL.length - 1)!== '/') {
    DATABASE_URL = `${DATABASE_URL}/`
  }
  dbUrl = `${DATABASE_URL}${DATABASE_NAME}`
}

export let db: Db
export let client: MongoClient

// function that finishes after the connection to the database has successfully been made or not
// eslint-disable-next-line no-async-promise-executor
export const awaitDatabaseConnection = new Promise<{ db: Db, client: MongoClient }>(async (resolve, reject) => {
  try {
    const _client = await connect(dbUrl, { serverSelectionTimeoutMS: env_variables.DATABASE.timeout })

    db = _client.db(DATABASE_NAME)
    client = _client
    // connection successfully made
    resolve({ db, client })
  } catch (e) {
    console.log(e)
    // could not connect to the database
    reject(false)
  }
})