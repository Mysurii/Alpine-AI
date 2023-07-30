import { IRead, IWrite } from '@common/interfaces/database'
import { Collection, Db, ObjectId } from 'mongodb'
import { getDbInstance } from '@config/db'

interface ID {
  _id: string | ObjectId
}

export abstract class BaseRepository<T extends ID> implements IRead<T>, IWrite<T> {
  protected collection!: Collection

  constructor() {
    getDbInstance().then((db) => {
      this.collection = db.collection(this.getCollectionName())
    })
  }

  abstract getCollectionName(): string

  find = async (): Promise<T[]> => {
    return this.collection.find<T>({}).toArray()
  }
  findOne = async (_id: string): Promise<T | null> => {
    const document = await this.collection.findOne<T>({ _id: new ObjectId(_id) })
    return document
  }
  create = async (item: Omit<T, '_id'>): Promise<T> => {
    const result = await this.collection.insertOne(item)
    const doc = await this.findOne(result.insertedId.toString())

    if (!doc) throw new Error('Failed to fetch inserted document!')
    return doc
  }
  update = async (id: string, item: Partial<T>): Promise<boolean> => {
    const result = await this.collection.findOneAndUpdate({ _id: new ObjectId(id) }, { $set: item })
    return !!result.value
  }
  delete = async (id: string): Promise<boolean> => {
    const result = await this.collection.deleteOne({ _id: new ObjectId(id) })
    return !!result.acknowledged
  }
}
