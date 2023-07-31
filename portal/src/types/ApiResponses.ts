export interface ApiErrorResponse {
  message: string
  status: HTTP_STATE
  error: string
}

type Role = 'user' | 'admin'

export interface SuccessLogin {
  role: Role
  name: string
  accessToken: string
  refreshToken: string
}

export interface SuccessLogout {
  message: string
}

interface HTTP_STATE {
  code: number
  status: string
}
