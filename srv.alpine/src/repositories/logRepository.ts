import DatabaseRepository from './abstracts/databaseRepository'
import { COLLECTIONS } from './collections'
import type { Log } from '../models/log'
import type { InsertOneResult } from 'mongodb'

export default class LogRepository extends DatabaseRepository {

  addLog (log: Log): Promise<InsertOneResult> {
    return this.insertDocument(log)
  }

  protected getCollectionName(): string {
    return COLLECTIONS.LOGS
  }
}