import { teardown } from 'jest-dev-server'

module.exports = async function globalTeardown() {
  console.log('\nTests are finished')
  console.log('Closing the server...\n')

  await teardown()
  process.exit(0)
}