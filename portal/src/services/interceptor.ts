import { router } from './../pages/router'
import axios from 'axios'
import envVariables from '../config'
import { toast } from 'react-hot-toast'

interface IToken {
  accessToken: string
  refreshToken: string
}

export const api = axios.create({
  baseURL: envVariables.api_endpoint,
  headers: {
    'Content-Type': 'application/json',
  },
})

const excludedRefreshEndpoints: string[] = ['/login/password']

// Request interceptor -> should add web tokens to request
api.interceptors.request.use(
  (request) => {
    console.log(request)

    let token: IToken | string | null = localStorage.getItem('token')

    if (token !== null) {
      token = JSON.parse(token) as IToken
      // eslint-disable-next-line
      request.headers!.Authorization = `Bearer ${token.accessToken}`
    }

    return request
  },
  async function (error) {
    await Promise.reject(error)
  }
)

// Response interceptor -> should refresh webtokens
api.interceptors.response.use(
  (response) => {
    console.log(response)
    return response
  },
  async function (error) {
    // Original request to send when refreshing
    if (error.code === 'ERR_NETWORK') {
      return await Promise.reject(error)
    }
    const originalRequest = error.config
    const data = error.response.data

    const isExcludedEndpoint = excludedRefreshEndpoints.some((endpoint) => {
      return error.request.responseURL.includes(endpoint)
    })

    // refresh accessTokens
    if (data?.status === 401 && (data?.message === 'Access token has expired' || data?.message === 'Access token is invalid') && !isExcludedEndpoint && !originalRequest._retry) {
      originalRequest._retry = true
      let storedToken: IToken | string | null = localStorage.getItem('token')
      if (storedToken) {
        storedToken = JSON.parse(storedToken) as IToken
        try {
          const response = await axios.post(`${envVariables.api_endpoint}/login/refresh`, { refreshToken: storedToken.refreshToken })
          const { data }: { data: IToken } = response
          const newToken = JSON.stringify({
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
          })
          localStorage.setItem('token', newToken)
          // resend previous api request
          api.defaults.headers.common.Authorization = `Bearer ${data.accessToken}`
          return await api({
            ...originalRequest,
            headers: { ...originalRequest.headers, Authorization: `Bearer ${data.accessToken}` },
            sent: true,
          })
        } catch (err: any) {
          const data = err.response?.data

          // User has to login if the refresh token is expired
          if (data?.message === 'Refresh token invalid' || data?.message === 'Refresh token expired') {
            toast('Session ended. login is required.')
            // history.push('/login')
            router.navigate('/login', { replace: true })
            return
          }

          await Promise.reject(err)
          return
        }
      }
    }
    return await Promise.reject(error)
  }
)
