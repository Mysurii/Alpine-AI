export interface IRole {
  USER: 'user'
  ADMIN: 'admin'
}

export interface ICreateUser {
  name: string
  email: string
  password: string
}

export interface ILoginUser {
  email: string
  password: string
}

export interface IUser {
  _id: string
  name: string
  role: IRole
}
