import { ObjectId } from 'mongodb'

interface ID {
  _id: string | ObjectId
}
export interface IWrite<T extends ID> {
  create(item: Omit<T, '_id'>): Promise<T>
  update(id: string, item: T): Promise<boolean>
  delete(id: string): Promise<boolean>
}

export interface IRead<T extends ID> {
  find(): Promise<T[]>
  findOne(id: string): Promise<T | null>
}
