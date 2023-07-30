import User from './user.model'
import UserRepository from './user.repository'

class UserService {
  private userRepository: UserRepository

  constructor() {
    this.userRepository = new UserRepository()
  }

  async findById(id: User['_id']) {
    return this.userRepository.findOne(id)
  }

  async create(user: User) {
    return this.userRepository.create(user)
  }
  async update(user: User) {
    return this.userRepository.update(user._id, user)
  }
  async delete(userId: User['_id']) {
    return this.userRepository.delete(userId)
  }
}

export default UserService
