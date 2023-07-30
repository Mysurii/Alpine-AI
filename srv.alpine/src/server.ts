import 'module-alias/register'
import 'dotenv/config'
import app, { databaseClient } from './app'
import type { Server } from 'http'

let server: Server = app.bootServer()

process.on('SIGINT', cleanup)
process.on('SIGTERM', cleanup)

process.on('unhandledRejection', (error, promise) => {
  console.error(`Error: ${error}`)
  server.close(() => process.exit(1))
})

async function cleanup(): Promise<void> {
  server.close(async (err) => {
    if (err) console.warn('Server was never opened..')
    const hasConnection = databaseClient !== null

    if (hasConnection) {
      console.log('Closing database connection..')
      await databaseClient.close()
    }
  })
}
