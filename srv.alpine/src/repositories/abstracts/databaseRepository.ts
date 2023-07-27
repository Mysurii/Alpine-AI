import type { AggregationCursor, Collection, Db, DeleteResult, Document, Filter, FindOptions, InsertOneResult, MongoClient, MongoError, ObjectId, OptionalUnlessRequiredId, UpdateFilter, UpdateResult } from 'mongodb'
import type { MongoExtendedFind } from 'mongodb-helper'
import { db as database, client as databaseClient } from '../../config'
import type { ID } from '../../models/authentication'
import { generateId, parseId } from '../../util/util'

abstract class DatabaseRepository {
  protected db: Db
  protected client: MongoClient
  protected collection!: Collection

  protected abstract getCollectionName (): string

  constructor (_database?: Db, _databaseClient?: MongoClient) {
    this.db = typeof _database === 'undefined' ? database : _database
    this.client = typeof _databaseClient === 'undefined' ? databaseClient : _databaseClient
    this.collection = this.db.collection(this.getCollectionName())
  }

  protected aggregate(aggregation: MongoExtendedFind): Promise<AggregationCursor<Document>> {
    return new Promise((resolve, reject) => {
      try {
        const response = this.collection.aggregate(aggregation)
        resolve(response)
      } catch (error) {
        this.handleError(reject, error as MongoError)
      }
    })
  }

  protected insertDocument<T>(document: OptionalUnlessRequiredId<T>): Promise<InsertOneResult<Document>> {
    return new Promise((resolve, reject) => {
      try {
        document._id = generateId()
        const response = this.collection.insertOne(document)      
        resolve(response)
      } catch (error) {
        this.handleError(reject, error as MongoError)
      }
    })
  }

  protected updateDocument(filter: Record<string, unknown> = {}, update: UpdateFilter<Document> | Partial<Document>): Promise<UpdateResult> {
    return new Promise((resolve, reject) => {
      try {
        const response = this.collection.updateOne(filter, update)
        resolve(response)
      } catch (error) {
        this.handleError(reject, error as MongoError)
      }
    })
  }

  protected getDocuments<T>(filter: Record<string, unknown> = {}, options?: FindOptions<Document>): Promise<Array<T>> {
    return new Promise((resolve, reject) => {
      try {
        const response = this.collection.find(filter, options).toArray() as Promise<Array<T>>
        resolve(response)
      } catch (error) {
        this.handleError(reject, error as MongoError)
      }
    })
  }

  protected getDocument<T>(filter: Record<string, unknown>, options?: FindOptions<Document>): Promise<T | null> {
    return new Promise((resolve, reject) => {
      try {
        const response = this.collection.findOne<T>(filter, options)
        resolve(response)
      } catch (error) {
        this.handleError(reject, error as MongoError)
      }
    })
  }

  protected deleteDocument(filter: Filter<Document>): Promise<DeleteResult> {
    return new Promise((resolve, reject) => {
      try {
        const response = this.collection.deleteOne(filter)
        resolve(response)
      } catch (error) {
        this.handleError(reject, error as MongoError)
      }
    })
  }

  protected getDocumentById<T>(id: ID, options?: FindOptions<Document>) {
    return this.getDocument<T>({ _id: this.parseId(id) }, options)
  }

  protected updateDocumentById(id: ID, updateFilter: UpdateFilter<Document> | Partial<Document>) {
    const filter = { _id: parseId(id) }
    return this.updateDocument(filter, updateFilter)
  }

  protected deleteDocumentById(id: ID): Promise<DeleteResult> {
    const filter = { _id: parseId(id) }
    return this.deleteDocument(filter)
  }

  protected parseId(id: ID): ObjectId|string {
    return parseId(id)
  }

  protected handleError (reject: (error?: unknown) => void, error: MongoError): void {
    if (error) {
      console.log(error)
      reject(error)
    }
  }
}

export default DatabaseRepository