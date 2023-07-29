import 'module-alias/register'
import app from './app'

const server = app.listen(8000, () => console.log('Server is listening on port 8000'))

process.on('SIGINT', cleanup)
process.on('SIGTERM', cleanup)

process.on('unhandledRejection', (error, promise) => {
  console.error(`Error: ${error}`)
  server.close(() => process.exit(1))
})

async function cleanup(): Promise<void> {
  server.close(async (err) => {
    if (err) console.warn('Server was never opened..')
  })
}
