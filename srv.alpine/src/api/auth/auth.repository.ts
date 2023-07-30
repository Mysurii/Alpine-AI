import { BaseRepository } from '@common/db/BaseRepository'
import Account from './account.model'

export default class AuthRepository extends BaseRepository<Account> {
  getCollectionName = (): string => 'user'

  findByEmail = async (email: string): Promise<Account | null> => {
    return await this.collection.findOne<Account>({ email })
  }
}
