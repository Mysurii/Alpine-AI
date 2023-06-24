import type { Db } from 'mongodb'
import { envVariables } from './config'
import { MongoClient } from 'mongodb'

export async function connectDb(): Promise<{ db: Db; client: MongoClient }> {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    try {
      const client = await MongoClient.connect(envVariables.DATABASE.url)
      const db = client.db(envVariables.DATABASE.name)
      resolve({ db, client })
    } catch (err: unknown) {
      reject(err)
    }
  })
}
