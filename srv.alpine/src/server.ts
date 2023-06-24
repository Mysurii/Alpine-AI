import type { Server } from 'http'
import { bootServer, databaseClient } from './app'
import 'dotenv/config'
import Logger from './config/Logger'

let server: Server

bootServer()
  .then((s) => (server = s))
  .catch((err) => {
    Logger.error('Something went wrong while booting up te server:')
    Logger.log(err)
  })

process.on('SIGINT', cleanup)
process.on('SIGTERM', cleanup)

async function cleanup(): Promise<void> {
  Logger.info('Server is closing...\n')
  server.close(async (err) => {
    if (err) Logger.warn('Server was never opened.')

    if (databaseClient != null) {
      Logger.info('Closing database connection...')
      await databaseClient.close()
    }
  })
}
