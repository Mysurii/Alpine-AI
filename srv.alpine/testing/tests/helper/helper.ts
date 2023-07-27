import { env_variables } from '../../../src/config'
import superagent from 'superagent'
import type { LoginRequest, SuccessLogin } from '../../../src/models/authentication'
import type { HTTP_STATE} from '../../../src/util/endpoint-util'

type query = string | string[][] | Record<string, string> | URLSearchParams

export const request = {
  get: (endpoint: string, expectedStatusCode: HTTP_STATE['code'], queryParameters?: query, accessToken?: string) => setMiddleware(superagent.get(createUrl(endpoint, queryParameters)), expectedStatusCode, accessToken),
  post: (endpoint: string, expectedStatusCode: HTTP_STATE['code'], queryParameters?: query, accessToken?: string) => setMiddleware(superagent.post(createUrl(endpoint, queryParameters)), expectedStatusCode, accessToken),
  head: (endpoint: string, expectedStatusCode: HTTP_STATE['code'], queryParameters?: query, accessToken?: string) => setMiddleware(superagent.head(createUrl(endpoint, queryParameters)), expectedStatusCode, accessToken),
  put: (endpoint: string, expectedStatusCode: HTTP_STATE['code'], queryParameters?: query, accessToken?: string) => setMiddleware(superagent.put(createUrl(endpoint, queryParameters)), expectedStatusCode, accessToken),
  patch: (endpoint: string, expectedStatusCode: HTTP_STATE['code'], queryParameters?: query, accessToken?: string) => setMiddleware(superagent.patch(createUrl(endpoint, queryParameters)), expectedStatusCode, accessToken),
  delete: (endpoint: string, expectedStatusCode: HTTP_STATE['code'], queryParameters?: query, accessToken?: string) => setMiddleware(superagent.delete(createUrl(endpoint, queryParameters)), expectedStatusCode, accessToken),
}

function setMiddleware(req: superagent.Request, expectedStatusCode: HTTP_STATE['code'], accessToken?: string): superagent.Request {
  req.ok((response: superagent.Response) => response.statusCode === expectedStatusCode)

  if (typeof accessToken !== 'undefined') {
    req.set('Authorization', `Bearer ${accessToken}`)
  }

  return req
}

function createUrl(endpoint: string, queryParameters?: string | string[][] | Record<string, string> | URLSearchParams): string {
  let url = `http://localhost:${env_variables.PORT}${endpoint.charAt(0) === '/' ? endpoint : `/${endpoint}`}`

  if (queryParameters) {
    url += `?${new URLSearchParams(queryParameters)}`
  }

  return url
}

export function login(login: Partial<LoginRequest> | undefined, expectedStatusCode = 200): superagent.Request {
  return request
    .post('/login', expectedStatusCode)
    .send(login)
}

export async function getTokens(login: typeof ACCOUNTS['ADMIN'], expectedStatusCode = 200): Promise<SuccessLogin> {
  if (typeof login.accessToken !== 'undefined' && typeof login.refreshToken !== 'undefined') {
    return { accessToken: login.accessToken, refreshToken: login.refreshToken, role: login.role!, name: login.name! }
  }

  const tokens = (await request
    .post('/login', expectedStatusCode)
    .send(login)).body as SuccessLogin

  const obj = Object.values(ACCOUNTS).find(acc => acc.email === login.email)

  if (typeof obj !== 'undefined') {
    obj.accessToken = tokens.accessToken
    obj.refreshToken = tokens.refreshToken
    obj.role = tokens.role
  }

  return tokens
}

export async function refreshTokens<T>(refreshToken: string, expectedStatusCode = 200): Promise<{ response: superagent.Response, body: T }> {
  const response = await request.post('/login/refresh', expectedStatusCode).send({ refreshToken })

  return { response, body: response.body }
}

export const ACCOUNTS: Record<string, LoginRequest & Partial<SuccessLogin>> = {
  ADMIN: {
    email: 'jesmo@gmail.com',
    password: 'jesmo'
  },
  STANDARD: {
    email: 'user@gmail.com',
    password: 'user'
  }
}