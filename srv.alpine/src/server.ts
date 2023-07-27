import 'dotenv/config'
import chalk from 'chalk'

import { Server } from 'http'
import { bootServer, databaseClient } from './app'

let server: Server
bootServer().then(s => server = s).catch(e => {
  console.log('Something went wrong while booting up the server...')
})

process.on('SIGINT', cleanup)
process.on('SIGTERM', cleanup)

async function cleanup (): Promise<void> {
  console.log(chalk.yellow('Server is closing...\n'))
  server.close(async (error) => {
    if (error) {
      console.log(chalk.red('Server was never opened'))
    }
    const hasConnection = databaseClient != null
    console.log(chalk.yellow(`Has database connection: ${hasConnection ? chalk.green(hasConnection) : chalk.red(hasConnection)}`))
    if (hasConnection) {
      console.log(chalk.yellow('Closing database connection...'))
      await databaseClient.close()
    }
  })
}