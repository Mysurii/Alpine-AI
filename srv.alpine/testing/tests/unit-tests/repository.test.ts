import { awaitDatabaseConnection } from '../../../src/config'
import type AIRepository from '../../../src/repositories/aiRepository'
import type ChatBotRepository from '../../../src/repositories/chatbotRepository'
import type LogRepository from '../../../src/repositories/logRepository'
import { getAIRepository, getChatbotRepository, getLogRepository, getUsersRepository } from '../../../src/repositories/repos'
import type UsersRepository from '../../../src/repositories/usersRepository'

describe('Repository tests', () => {
  let usersRepository: UsersRepository
  let chatbotRepository: ChatBotRepository
  let logRepository: LogRepository
  let aiRepository: AIRepository

  beforeAll(async () => {
    const { client, db } = await awaitDatabaseConnection

    usersRepository = getUsersRepository(db, client)
    chatbotRepository = getChatbotRepository(db, client)
    logRepository = getLogRepository(db, client)
    aiRepository = getAIRepository()
  })

  it('[UsersRepository] Retrieve user', async () => {
    const mail = 'jesmo@gmail.com'
    const user = await usersRepository.getUserByEmail(mail, { _id: 1 })

    expect(user).not.toBeNull()
  })

  it('[UsersRepository] is access token valid', async () => {
    const mail = 'jesmo@gmail.com'
    const user = await usersRepository.getUserByEmail(mail, { _id: 1, tokens: 1 })

    expect(user).not.toBeNull()

    if (user != null) {
      const valid = await usersRepository.isAccessTokenValid(user?._id, 'token')
      expect(valid).toBeFalsy()
    }
  })

  it('[ChatbotRepository] ...', async () => {
    expect(1).toBe(1)
  })

  it('[LogRepository] ...', async () => {
    expect(1).toBe(1)
  })

  it('[AIRepository] ...', async () => {
    expect(1).toBe(1)
  })
})