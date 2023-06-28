import { ICreateUser, ILoginUser, IUser } from '../types/user.type'
import { post, put, request } from './request'
import { SuccessLogin } from '../types/apiresponse.type'
import { AxiosResponse } from 'axios'

export async function createUser(user: ICreateUser): Promise<AxiosResponse | undefined> {
  try {
    const response = await post('auth/register', user)
    if (response?.data?.accessToken) {
      const accessToken = response.data.accessToken
      localStorage.setItem('token', JSON.stringify({ accessToken }))
    }
    return response?.data
  } catch (err) {
    console.log('err creating user: ', err)
    throw err
  }
}

export async function verifyUser(verificationCode: string): Promise<AxiosResponse | undefined> {
  return await post('login/verify', { verificationCode })
}

export async function loginUser(loginCredentials: ILoginUser): Promise<IUser | undefined> {
  try {
    const response = await request<ILoginUser, SuccessLogin>('POST', 'auth/login', loginCredentials)

    const name = response.data.name
    const accessToken = response.data.accessToken
    const refreshToken = response.data.refreshToken
    localStorage.setItem('token', JSON.stringify({ accessToken, refreshToken }))

    const decodedAccessToken = JSON.parse(window.atob(accessToken.split('.')[1]).toString())

    const user: IUser = {
      role: decodedAccessToken.role,
      name,
    }

    localStorage.setItem('user', JSON.stringify(user))

    return user
  } catch (err) {
    console.log('err logging in user: ', err)
    throw err
  }
}

export async function forgotPassword(email: ILoginUser['email']): Promise<string> {
  try {
    const response = await put('login/reset-password', { email })

    return response?.data
  } catch (error) {
    return error as string
  }
}

export async function changePassword(newPassword: ILoginUser['password'], verificationCode: string): Promise<boolean | string> {
  try {
    const response = await put('login/password', { password: newPassword, verificationCode })

    if (response?.status === 204) {
      return true
    } else if (response?.status === 401) {
      return 'Change password link has expired'
    } else {
      return response?.data.message
    }
  } catch (error) {
    console.log(error)
    return error as string
  }
}
