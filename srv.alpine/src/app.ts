import type { Express } from 'express'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import authRoute from './api/auth'
import errorHandler from '@middlewares/errorHandler.middleware'
import { TokenPayload } from '@api/auth/types/loginRequest'
import { envVariables } from '@config/variables'
import { Server } from 'http'
import type { Db, MongoClient } from 'mongodb'
import { connectDb } from '@config/db'

export let database: Db
export let databaseClient: MongoClient

declare global {
  namespace Express {
    interface Request {
      user?: Omit<TokenPayload, 'type'>
    }
  }
}

class AppController {
  express: Express

  constructor() {
    this.express = express()
  }

  public bootServer(): Server {
    connectDb
      .then(({ db, client }) => {
        database = db
        databaseClient = client
      })
      .catch((err) => {
        throw Error('Could not connect to the database.')
      })
    this.middlewares()
    this.routes()
    return this.express.listen(envVariables.PORT, () => console.log(`Server is listening on port ${envVariables.PORT}`))
  }

  private middlewares() {
    // allow cross origin
    this.express.use(cors())
    // prevent well-known web vulnerabilities
    this.express.use(helmet())
    // parse data from/to strings and arrays
    this.express.use(express.urlencoded({ extended: false }))
    // parse data from/to json objects
    this.express.use(express.json())
  }

  private routes() {
    this.express.use('/api/auth', authRoute)
    // errors handling, should be last in the chain!
    this.express.use(errorHandler)
  }
}

export default new AppController()
