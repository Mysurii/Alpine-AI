import type { User } from 'models/User'
import BaseRepository from './base.repository'

export default class UserRepository extends BaseRepository<User> {
  constructor() {
    super('user')
  }

  protected getCollectionName(): string {
    return 'users'
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.collection.findOne<User>({ email })
    return user
  }
}
