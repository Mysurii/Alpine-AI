import { HTTP_STATUS } from '../../../src/util/endpoint-util'
import { ACCOUNTS, request, getTokens } from '../helper/helper'

describe('Log endpoints tests', () => {
  it('Empty log request should return error', async () => {
    const tokens = await getTokens(ACCOUNTS.STANDARD)

    const req = request.post('/log', HTTP_STATUS.BAD.code, undefined, tokens.accessToken)

    const response = await req

    expect(response.status).toBe(HTTP_STATUS.BAD.code)
    expect(response.body.message).toBe('Log type not set')
  })

  it('Invalid log type should return error', async () => {
    const tokens = await getTokens(ACCOUNTS.STANDARD)

    const req = request.post('/log', HTTP_STATUS.BAD.code, undefined, tokens.accessToken)
      .send({ type: 'not valid', log: { } })

    const response = await req

    expect(response.status).toBe(HTTP_STATUS.BAD.code)
    expect(response.body.message).toBe('Log type can only be of the following types: error, warning, info')
  })

  it('No log send should return error', async () => {
    const tokens = await getTokens(ACCOUNTS.STANDARD)

    const req = request.post('/log', HTTP_STATUS.BAD.code, undefined, tokens.accessToken)
      .send({ type: 'error' })

    const response = await req

    expect(response.status).toBe(HTTP_STATUS.BAD.code)
    expect(response.body.message).toBe('Log not set')
  })
})