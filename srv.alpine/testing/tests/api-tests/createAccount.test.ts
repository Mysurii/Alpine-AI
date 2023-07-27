import type { CreateAccount, SuccessLogin } from '../../../src/models/authentication'
import type { ErrorResponse } from '../../../src/models/response'
import { HTTP_STATUS } from '../../../src/util/endpoint-util'
import { ACCOUNTS, request } from '../helper/helper'

const newAccount: CreateAccount = {
  email: 'newUser@gmail.com',
  password: 'pA$sw0rd', //  minLength=8, minLowercase=1, minUppercase=1, minNumbers=1, minSymbols=1
  name: 'Jesmo'
}

describe('Create standard account tests', () => {
  // it('Create normal account', async () => {
  //   const response = await request
  //     .post('/login/create', HTTP_STATUS.CREATED.code)
  //     .send(newAccount)

  //   const body: SuccessLogin = response.body

  //   expect(response.status).toBe(HTTP_STATUS.CREATED.code)

  //   expect(body.accessToken).toBeDefined()
  //   expect(body.refreshToken).toBeDefined()
  //   expect(body.role).toBeDefined()

  //   expect(body.accessToken.length).toBeGreaterThan(0)
  //   expect(body.refreshToken.length).toBeGreaterThan(0)
  //   expect(body.role).toBe('user')
  // })

  it('Create account with not strong enough password', async () => {
    const toCreate = Object.assign({}, newAccount)
    toCreate.password = 'password'

    const response = await request
      .post('/login/create', HTTP_STATUS.BAD.code)
      .send(toCreate)

    const body: ErrorResponse = response.body

    expect(response.status).toBe(HTTP_STATUS.BAD.code)
    expect(body.message).toBe('Password not strong enough')
  })

  // it('Create account with used email', async () => {
  //   const toCreate = Object.assign({}, newAccount)
  //   toCreate.email = ACCOUNTS.ADMIN.email

  //   const response = await request
  //     .post('/login/create', 409)
  //     .send(newAccount)

  //   const body: ErrorResponse = response.body

  //   expect(response.status).toBe(409)
  //   expect(body.message).toBe('Email already in use')
  // })

  it('Create account with invalid email', async () => {
    const account = Object.assign({}, newAccount)
    account.email = 'loremsipim-@gmailtest=sdf.com'

    const response = await request
      .post('/login/create', HTTP_STATUS.BAD.code)
      .send(account)

    const body: ErrorResponse = response.body

    expect(response.status).toBe(HTTP_STATUS.BAD.code)
    expect(body.message).toBe('Email is not valid')
  })
})