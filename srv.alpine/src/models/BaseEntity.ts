import type { ObjectId } from 'mongodb'

export type ID = ObjectId | string

export type BaseEntity = {
  _id: ID
}
