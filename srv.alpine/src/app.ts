import type { Express } from 'express'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'

class AppController {
  express: Express

  constructor() {
    this.express = express()
    this.middlewares()
    this.routes()
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

  private routes() {}
}

export default new AppController().express
