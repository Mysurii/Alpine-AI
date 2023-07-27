import 'dotenv/config' // used to expose the .env variables as soon as possible
import type { Collection} from 'mongodb-helper'
import { init, connect } from 'mongodb-helper'
import { env_variables } from '../src/config'

const collections: Array<Collection> = [
  { name: 'Users', indexes: [], dataSourcePath: `${__dirname}/data/Users.json` }
];

(async () => {
  const client = await connect(env_variables.DATABASE.url)

  await init(client, env_variables.DATABASE.name, collections)

  // close this script
  process.exit(0)
})()