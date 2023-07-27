import type { Chatbot, CreateChatbot } from '../../../src/models/chatbot'
import type { ErrorResponse } from '../../../src/models/response'
import { HTTP_STATUS } from '../../../src/util/endpoint-util'
import { generateId, isValidId } from '../../../src/util/util'
import { ACCOUNTS, getTokens, request } from '../helper/helper'
import { createModifyChatbot, deleteChatbot, getChatbot, getChatbots } from '../helper/endpoint-helper'

const newChatbot: CreateChatbot = {
  name: 'New Chatbot'
}

const INVALID_ID = '1234567'
const VALID_ID = generateId()

describe('Chatbot retrieval tests', () => {
  it('Can\'t retrieve chatbots without authtentication', async () => {
    const { response, body } = await getChatbots<ErrorResponse>(HTTP_STATUS.UNAUTHORIZED.code)

    expect(response.status).toBe(HTTP_STATUS.UNAUTHORIZED.code)
    expect(body.message).toBe('No access token set')
  })

  it('Can\'t retrieve chatbot with invalid id', async () => {
    const { accessToken } = await getTokens(ACCOUNTS.ADMIN)

    const { response, body } = await getChatbot<ErrorResponse>(INVALID_ID, HTTP_STATUS.BAD.code, accessToken)

    expect(response.status).toBe(HTTP_STATUS.BAD.code)
    expect(body.message).toBe('Given id is not valid')
  })

  it('Can\'t retrieve chatbot that does not exist', async () => {
    const { accessToken } = await getTokens(ACCOUNTS.ADMIN)

    const { response, body } = await getChatbot<ErrorResponse>(VALID_ID.toString(), HTTP_STATUS.NOT_FOUND.code, accessToken)

    expect(response.status).toBe(HTTP_STATUS.NOT_FOUND.code)
    expect(body.message).toBe('Chatbot not found')
  })

  it('Retrieve all chatbots', async () => {
    const { accessToken } = await getTokens(ACCOUNTS.ADMIN)

    const { response, body } = await getChatbots<Array<Chatbot>>(HTTP_STATUS.OK.code, accessToken)

    expect(response.status).toBe(HTTP_STATUS.OK.code)
    expect(body.length).toBeGreaterThan(0)

    for (const chatbot of body) {
      expect(isValidId(chatbot._id)).toBeTruthy()
    }
  })

  it('Retrieve specific chatbot', async () => {
    const { accessToken } = await getTokens(ACCOUNTS.ADMIN)

    const { body } = await getChatbots<Array<Chatbot>>(HTTP_STATUS.OK.code, accessToken)

    expect(body.length).toBeGreaterThan(0)

    const { response, body: chatbot } = await getChatbot<Chatbot>(body[0]._id.toString(), HTTP_STATUS.OK.code, accessToken)

    expect(response.status).toBe(HTTP_STATUS.OK.code)
    expect(isValidId(chatbot._id)).toBeTruthy()
  })
})

describe('Chatbot creation/modification tests', () => {
  it('Can\'t create chatbots without authtentication', async () => {
    const response = await request.post('/chatbots', HTTP_STATUS.UNAUTHORIZED.code, undefined).send(newChatbot)

    expect(response.status).toBe(HTTP_STATUS.UNAUTHORIZED.code)
    expect(response.body.message).toBe('No access token set')
  })

  it('Can\'t create chatbot without name', async () => {
    const { accessToken } = await getTokens(ACCOUNTS.ADMIN)

    const bot = Object.assign({}, newChatbot) as Partial<CreateChatbot>
    delete bot.name

    const { response } = await createModifyChatbot<ErrorResponse>(bot, HTTP_STATUS.BAD.code, accessToken)

    expect(response.status).toBe(HTTP_STATUS.BAD.code)
    expect(response.body.message).toBe('name is required')
  })

  it('Successfully create chatbot', async () => {
    const { accessToken } = await getTokens(ACCOUNTS.ADMIN)
    const { body } = await createModifyChatbot<Chatbot>(newChatbot, HTTP_STATUS.CREATED.code, accessToken)

    expect(body._id).toBeDefined()
    expect(body.createdAt).toBeDefined()
    expect(body.name).toBe(newChatbot.name)
  })

  it('Can\'t change chatbot with invalid ID', async () => {
    const { accessToken } = await getTokens(ACCOUNTS.ADMIN)

    const bot = Object.assign({}, newChatbot) as Required<Partial<Chatbot>>
    bot._id = INVALID_ID
    bot.name = 'this will fail'

    const { response, body } = await createModifyChatbot<ErrorResponse>(bot, HTTP_STATUS.BAD.code, accessToken)

    expect(response.status).toBe(HTTP_STATUS.BAD.code)
    expect(body.message).toBe('Given id is not valid')
  })

  it('Can\'t change chatbot that does not exists', async () => {
    const { accessToken } = await getTokens(ACCOUNTS.ADMIN)

    const bot = Object.assign({}, newChatbot) as Required<Partial<Chatbot>>
    bot._id = VALID_ID
    bot.name = 'this will fail'

    const { response, body } = await createModifyChatbot<ErrorResponse>(bot, HTTP_STATUS.NOT_FOUND.code, accessToken)

    expect(response.status).toBe(HTTP_STATUS.NOT_FOUND.code)
    expect(body.message).toBe('Chatbot not found')
  })

  it('Change chatbot name', async () => {
    const { accessToken } = await getTokens(ACCOUNTS.ADMIN)

    const { body: chatbots } = await getChatbots<Array<Chatbot>>(HTTP_STATUS.OK.code, accessToken)

    expect(chatbots.length).toBeGreaterThan(0)

    const toModify = chatbots[0]
    toModify.name = 'Not the originalName'

    const { body } = await createModifyChatbot<Chatbot>(toModify, HTTP_STATUS.OK.code, accessToken)

    expect(body.name).toBe(toModify.name)
  })
})

describe('Chatbot deletion tests', () => {
  it('Can\'t delete chatbots without authtentication', async () => {
    const { response, body } = await deleteChatbot<ErrorResponse>('', HTTP_STATUS.UNAUTHORIZED.code)

    expect(response.status).toBe(HTTP_STATUS.UNAUTHORIZED.code)
    expect(body.message).toBe('No access token set')
  })

  it('Can\'t delete chatbot with invalid id', async () => {
    const { accessToken } = await getTokens(ACCOUNTS.ADMIN)

    const { response, body } = await deleteChatbot<ErrorResponse>(INVALID_ID, HTTP_STATUS.BAD.code, accessToken)

    expect(response.status).toBe(HTTP_STATUS.BAD.code)
    expect(body.message).toBe('Given id is not valid')
  })

  it('Can\'t delete chatbot that does not exist', async () => {
    const { accessToken } = await getTokens(ACCOUNTS.ADMIN)

    const { response, body } = await deleteChatbot<ErrorResponse>(VALID_ID, HTTP_STATUS.NOT_FOUND.code, accessToken)

    expect(response.status).toBe(HTTP_STATUS.NOT_FOUND.code)
    expect(body.message).toBe('Chatbot not found')
  })

  it('Delete chatbot', async () => {
    const { accessToken } = await getTokens(ACCOUNTS.ADMIN)

    const { body: chatbots } = await getChatbots<Array<Chatbot>>(HTTP_STATUS.OK.code, accessToken)

    expect(chatbots.length).toBeGreaterThan(0)

    const { response } = await deleteChatbot(chatbots[0]._id, HTTP_STATUS.NO_CONTENT.code, accessToken)
    expect(response.status).toBe(HTTP_STATUS.NO_CONTENT.code)
  })
})