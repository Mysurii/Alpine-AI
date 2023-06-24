import type { Application } from 'express'
import type { Db, MongoClient } from 'mongodb'
import type { Server } from 'http'
import helmet from 'helmet'
import cors from 'cors'
import express from 'express'
import chalk from 'chalk'

import { envVariables } from './config/config'
import { connectDb } from './config/db'
import Logger from './config/Logger'
import { rateLimiter } from 'middlewares/ratelimiter.middleware'

export let database: Db
export let databaseClient: MongoClient

export function bootServer(): Promise<Server> {
  return new Promise((resolve, reject) => {
    try {
      Logger.info('Booting up the server')
      Logger.log('> Trying to connect to the database')
      connectDb()
        .then(({ db, client }) => {
          Logger.log('> Connected to the database!')
          database = db
          databaseClient = client

          const app: Application = express()

          // allow CROSS ORIGIN
          app.use(cors())

          // is a set of middlewares that sets response headers to help prevent some well-known web vulnerabilities
          app.use(helmet())

          // set the rate limit middleware, if the requester has reached the rate limit, the request will end here and won't go further through the request chain.
          app.use(rateLimiter)

          // first middleware in the request chain is the urencoded and parses form data (application/x-www-form-urlencoded)
          app.use(express.urlencoded({ extended: false }))

          // second middleware in the request chain is the JSON parser middleware. Parsed request body if the application/json Content-Type is set
          app.use(express.json())

          const server = app.listen(envVariables.PORT, () => {
            console.log(`\nServer is listening on port ${chalk.green(envVariables.PORT)}`)
            resolve(server)
          })
        })
        .catch(() => {
          Logger.error('Could not connect to the database.')
        })
    } catch (err) {
      Logger.error(err)
      reject(err)
    }
  })
}
