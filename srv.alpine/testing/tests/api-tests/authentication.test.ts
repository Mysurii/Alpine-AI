import type { RefreshedTokens, SuccessLogin } from '../../../src/models/authentication'
import type { ErrorResponse } from '../../../src/models/response'
import { HTTP_STATUS } from '../../../src/util/endpoint-util'
import { login, ACCOUNTS, getTokens, refreshTokens } from '../helper/helper'

describe('Login tests', () => {
  it('Can\'t login without sending body', async () => {
    const response = await login(undefined, HTTP_STATUS.BAD.code)

    const body: ErrorResponse = response.body

    expect(body.status).toBe(HTTP_STATUS.BAD.code)
    expect(body.message).toBe('Email and password are required')
  })

  it('Can\'t login without username', async () => {
    const response = await login({ password: ACCOUNTS.ADMIN.password }, HTTP_STATUS.BAD.code)

    const body: ErrorResponse = response.body

    expect(body.status).toBe(HTTP_STATUS.BAD.code)
    expect(body.message).toBe('Email and password are required')
  })

  it('Can\'t login without password', async () => {
    const response = await login({ email: ACCOUNTS.ADMIN.email }, HTTP_STATUS.BAD.code)

    const body: ErrorResponse = response.body

    expect(body.status).toBe(HTTP_STATUS.BAD.code)
    expect(body.message).toBe('Email and password are required')
  })

  it('Wrong username, password combination', async () => {
    const response = await login({ email: ACCOUNTS.ADMIN.email, password: '54321' }, HTTP_STATUS.UNAUTHORIZED.code)

    const body: ErrorResponse = response.body

    expect(body.status).toBe(HTTP_STATUS.UNAUTHORIZED.code)
    expect(body.message).toBe('Email and password combination is not correct')
  })

  it('Can login as admin', async () => {
    const response = await login(ACCOUNTS.ADMIN, HTTP_STATUS.OK.code)

    const body: SuccessLogin = response.body

    expect(response.status).toBe(HTTP_STATUS.OK.code)
    
    expect(body.accessToken).toBeDefined()
    expect(body.refreshToken).toBeDefined()
    expect(body.role).toBeDefined()

    expect(body.accessToken.length).toBeGreaterThan(0)
    expect(body.refreshToken.length).toBeGreaterThan(0)
    expect(body.role).toBe('admin')
  })

  it('Can login as user', async () => {
    const response = await login(ACCOUNTS.STANDARD, HTTP_STATUS.OK.code)

    const body: SuccessLogin = response.body

    expect(response.status).toBe(HTTP_STATUS.OK.code)
    
    expect(body.accessToken).toBeDefined()
    expect(body.refreshToken).toBeDefined()
    expect(body.role).toBeDefined()

    expect(body.accessToken.length).toBeGreaterThan(0)
    expect(body.refreshToken.length).toBeGreaterThan(0)
    expect(body.role).toBe('user')
  })
})

describe('Refresh tokens tests', () => {
  it('Refresh valid access token', async () => {
    // access token hasn't expired yet so the same access token should be returned
    const firstTokens = await getTokens(ACCOUNTS.STANDARD)

    // delay of 3 seconds to make sure another token gets generated
    await new Promise(resolve => setTimeout(resolve, 3000))

    const { response, body: { accessToken, refreshToken } }  = await refreshTokens<RefreshedTokens>(firstTokens.refreshToken, HTTP_STATUS.OK.code)
    
    expect(response.status).toBe(HTTP_STATUS.OK.code)

    expect(firstTokens.accessToken).toBe(accessToken)
    expect(firstTokens.refreshToken).not.toBe(refreshToken)
  })

  it('Refresh tokens with invalid refresh token', async () => {
    const { response, body: { message } }  = await refreshTokens<ErrorResponse>('Lorem ipsum', HTTP_STATUS.BAD.code)

    expect(response.status).toBe(HTTP_STATUS.BAD.code)
    expect(message).toBe('Refresh token invalid')
  })
})