import path from 'path'
import dotenv from 'dotenv'
dotenv.config({ path: path.resolve(__dirname, '../.test.env') })

import waitOn from 'wait-on'
import { setup as setupDevServer } from 'jest-dev-server'
import { env_variables } from '../src/config'

module.exports = async function globalSetup() {
  await setupDevServer({
    command: 'npm run testServer',
    launchTimeout: 10000, // after 10 seconds of no response or anything the function fails
    debug: true // enable the logs from the server
  }) // boot the test server

  try {
    // wait until the resource is accessible and the response status does not return 404 before the tests start. 
    // Every route is inaccessible and returns 404 if the server isn't fully booted yet
    await waitOn({
      resources: [
        `http://localhost:${env_variables.PORT}/log`
      ],
      interval: 1000,
      delay: 1000,
      validateStatus: (status) => {
        return status !== 404
      }
    })
  } catch (e) {
    console.log(e)
  }
}