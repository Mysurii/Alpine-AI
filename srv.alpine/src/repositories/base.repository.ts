import type { Collection, Document, UpdateFilter } from 'mongodb'
import { MongoClient, ObjectId } from 'mongodb'
import type { ID } from '../models/BaseEntity'
import Logger from '../config/Logger'
import { envVariables } from '../config/config'

type availableRepos = 'user' | 'chatbot'

interface IRead<T> {
  findById: (id: string) => Promise<T | null>
  findAll: () => Promise<T[] | null>
}
interface IWrite<T> {
  insert: (item: T) => Promise<boolean>
  update: (id: string, item: T) => Promise<boolean>
  delete: (id: string) => Promise<boolean>
}

export default abstract class BaseRepository<T> implements IRead<T>, IWrite<T> {
  protected collection: Collection

  constructor(collectionName: availableRepos) {
    const client = new MongoClient(envVariables.DATABASE.url)
    this.collection = client.db().collection(collectionName)
  }

  async findById<T>(id: ID): Promise<T | null> {
    try {
      const response = await this.collection.findOne<T>({ _id: this.parseId(id) })
      return response
    } catch (err) {
      return this.handleError(err)
    }
  }

  async findAll(): Promise<Array<T> | null> {
    const response = this.collection.find({}).toArray() as Promise<Array<T>>
    return response
  }

  async insert(item: Partial<T>): Promise<boolean> {
    const { acknowledged } = await this.collection.insertOne(item as Document)
    return acknowledged
  }

  async update(id: ID, item: T): Promise<boolean> {
    const { acknowledged } = await this.collection.replaceOne({ _id: this.parseId(id) }, item as UpdateFilter<Document>)
    return acknowledged
  }

  async delete(id: ID): Promise<boolean> {
    const { acknowledged } = await this.collection.deleteOne({ _id: this.parseId(id) })
    return acknowledged
  }

  protected handleError(error: unknown): null {
    Logger.error('Error while trying to do DB operation:')
    Logger.error(error)
    return null
  }

  protected parseId(id: ID): ObjectId {
    return new ObjectId(id)
  }
}
