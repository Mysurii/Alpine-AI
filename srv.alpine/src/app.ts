/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-unused-vars */
import chalk from 'chalk'
import helmet from 'helmet'
import type { Application } from 'express'
import express from 'express'
import type { Server } from 'http'
import type { Db, MongoClient } from 'mongodb'
import { awaitDatabaseConnection, env_variables } from './config'
import {
  bodyCheckMiddleWare,
  errorHandlerMiddleware,
  escapeBodyMiddleware,
  notFoundMiddleware,
} from './middlewares/generalMiddlewares'
import { rateLimiter } from './middlewares/rateLimitMiddleware'
import type {Account, TokenPayload} from './models/authentication'
import cors from 'cors'
import type {Chatbot} from './models/chatbot'

export let database: Db
export let databaseClient: MongoClient

/**
 * used for TypeScript reasons to add the possible user property to the Request interface
 */
declare global {
  namespace Express {
    interface Request {
      user?: Omit<TokenPayload, 'type'>,
        encryptedToken?: { user: Request['user'], chatbotId?: Chatbot['_id'] }
    }
  }
}

// Boot express
export function bootServer(): Promise<Server> {
  return new Promise((resolve, reject) => {
    try {
      console.log('Booting up the server')

      console.log(' Trying to connect to the database')
      awaitDatabaseConnection
        .then(({ db, client }) => {
          console.log(' Connected to the database!')

          database = db
          databaseClient = client

          const app: Application = express()

          app.use(cors())

          // is a set of middlewares that sets response headers to help prevent some well-known web vulnerabilities
          app.use(helmet())

          // set the rate limit middleware, if the requester has reached the rate limit, the request will end here and won't go further through the request chain.
          app.use(rateLimiter)

          // first middleware in the request chain is the urencoded and parses form data (application/x-www-form-urlencoded)
          app.use(express.urlencoded({ extended: false }))

          // second middleware in the request chain is the JSON parser middleware. Parsed request body if the application/json Content-Type is set
          app.use(express.json())

          // if the JSON parser fails due to an invalid JSON body this middleware catches it and returns an error response
          app.use(bodyCheckMiddleWare)

          // escapes certain characters from (nested) values
          app.use(escapeBodyMiddleware)

          const authMiddleware = require('./middlewares/authorizationMiddleware')

          app.use(authMiddleware.default)

          const router = require('./routes')

          // Add all the controllers to the request chain
          router.routes(app)

          // the second to last middleware catches all requests that requested a non existing endpoint
          // after all the routes have been checked for the endpoint and none match was found, the Not Found middleware is called
          app.use(notFoundMiddleware)

          // the last middleware in the request chain catches all thrown Errors in the routes, depending on the type of error an appropiate message will be returned to the client
          app.use(errorHandlerMiddleware)

          const server = app.listen(env_variables.PORT, () => {
            console.log(
              `\nServer is listening on port ${chalk.green(env_variables.PORT)}`
            )
            resolve(server)
          })
        })
        .catch((e) => {
          console.log(e)
          // database connection could not be made, the server and it's endpoints won't be exposed
          console.log(
            chalk.red(
              'Could not connect to the database...\n  - Is the database running?\n  - Are the .env variables correct?'
            )
          )
        })
    } catch (e) {
      console.log(
        `${chalk.red('The server and it\'s endpoints are NOT exposed')}`
      )
      reject(e)
    }
  })
}
