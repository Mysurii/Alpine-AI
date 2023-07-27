import type { ObjectID } from 'bson'

export type ID = ObjectID | string

export type BaseModel = {
    _id: ID
    createdAt: string
}
