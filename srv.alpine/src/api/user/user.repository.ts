import { BaseRepository } from '@common/db/BaseRepository'
import User from './user.model'

class UserRepository extends BaseRepository<User> {
  getCollectionName = (): string => 'user'
}

export default UserRepository
