import ChatBotRepository from './chatbotRepository'
import LogRepository from './logRepository'
import type DatabaseRepository from './abstracts/databaseRepository'
import UsersRepository from './usersRepository'
import type HTTPRepository from './abstracts/httpRepository'
import AIRepository from './aiRepository'
import type { Db, MongoClient } from 'mongodb'

type HTTPRepoNames = 'ai'
type DBRepoNames = 'log' | 'users' | 'chatbot'
const repos: Partial<Record<DBRepoNames|HTTPRepoNames, DatabaseRepository|HTTPRepository>> = {}

function getRepo<T extends HTTPRepository>(repoName: HTTPRepoNames, repoType: any): T {
  let repo = repos[repoName]

  if (typeof repo === 'undefined') {
    repo = new repoType()
    repos[repoName] = repo
  }

  return repo as T
}

function getDatabaseRepo<T extends DatabaseRepository>(repoName: DBRepoNames, repoType: any, database?: Db, databaseClient?: MongoClient): T {
  let repo = repos[repoName]

  if (typeof repo === 'undefined') {
    repo = new repoType(database, databaseClient)
    repos[repoName] = repo
  }

  return repo as T
}

export function getChatbotRepository(database?: Db, databaseClient?: MongoClient): ChatBotRepository {
  return getDatabaseRepo('chatbot', ChatBotRepository, database, databaseClient)
}

export function getLogRepository(database?: Db, databaseClient?: MongoClient): LogRepository {
  return getDatabaseRepo('log', LogRepository, database, databaseClient)
}

export function getUsersRepository(database?: Db, databaseClient?: MongoClient): UsersRepository {
  return getDatabaseRepo('users', UsersRepository, database, databaseClient)
}

export function getAIRepository(): AIRepository {
  return getRepo('ai', AIRepository)
}
