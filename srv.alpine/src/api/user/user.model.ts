import { BaseModel } from '@common/interfaces/base-model'

type User = BaseModel & {
  name: string
  email: string
  password: string
}

export default User
