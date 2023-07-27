import { HTTP_STATUS } from '../../../src/util/endpoint-util'
import { request } from '../helper/helper'

describe('General Api tests', () => {
  it('Endpoint does not exist', async () => {
    const response = await request.get('///', HTTP_STATUS.NOT_FOUND.code)

    expect(response.status).toBe(HTTP_STATUS.NOT_FOUND.code)
    expect(response.body.message).toBe('Endpoint does not exist')
  })
})