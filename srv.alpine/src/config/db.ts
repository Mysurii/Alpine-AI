import { Db, MongoClient } from 'mongodb'
import { envVariables } from './variables'

let dbInstance: Db | null = null

// eslint-disable-next-line no-async-promise-executor
export const connectDb = new Promise<{ db: Db; client: MongoClient }>(async (resolve, reject) => {
  try {
    const client = new MongoClient(envVariables.DATABASE_URL)
    await client.connect()

    const db = client.db('alpine')
    resolve({ db, client })
  } catch (err: unknown) {
    console.log(err)
    reject(false)
  }
})

export async function getDbInstance(): Promise<Db> {
  if (!dbInstance) {
    dbInstance = (await connectDb).db
  }
  return dbInstance
}
