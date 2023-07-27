import DatabaseRepository from './abstracts/databaseRepository'
import { COLLECTIONS } from './collections'
import type { Account, CreateAccount, LoginRequest } from '../models/authentication'
import type { InsertOneResult, Document, UpdateFilter } from 'mongodb'

export default class UsersRepository extends DatabaseRepository {

  getUserById(_id: Account['_id'], fields: Record<string, 1 | 0>) {
    return this.getDocument<Account>({ _id: this.parseId(_id) }, { projection: fields })
  }

  getUserByEmail (email: LoginRequest['email'], fields: Record<string, 1 | 0>) {
    return this.getDocument<Account>({ email }, { projection: fields })
  }

  storeUser(newUser: Required<CreateAccount>): Promise<InsertOneResult<Document>> {
    return this.insertDocument(newUser)
  }
  async storeTokensByUserId(id: Account['_id'], tokens?: Account['tokens']): Promise<boolean> {
    let updateQuery: UpdateFilter<Document>

    if (typeof tokens === 'undefined') {
      updateQuery = {
        $unset: { tokens: 1 }
      }
    } else {
      updateQuery = { $set: { tokens } }
    }

    return (await this.updateDocumentById(id, updateQuery)).acknowledged
  }

  updateVerifiedStatusById(id: Account['_id']) {
    const updateQuery = { $unset: { verificationCode: 1, verified: 1 } }

    return this.updateDocumentById(id, updateQuery)
  }

  updatePasswordById(id: Account['_id'], newPassword: string) {
    const updateFilter: UpdateFilter<Document> = {
      $set: { password: newPassword }
    }

    return this.updateDocumentById(id, updateFilter)
  }

  storeVerificationCode(id: Account['_id'], verificationCode: string) {
    const updateFilter: UpdateFilter<Document> = {
      $set: { verificationCode }
    }

    return this.updateDocumentById(id, updateFilter)
  }

  async storeTempAccessTokenByUserId(id: Account['_id'], accessToken: Account['tokens']['accessToken']): Promise<boolean> {
    const filter = { _id: this.parseId(id) }
    const updateQuery = { $set: { tokens: { accessToken } } }

    return (await this.updateDocument(filter, updateQuery)).acknowledged
  }

  async isAccessTokenValid(id: Account['_id'], accessToken: Account['tokens']['accessToken']): Promise<boolean> {
    const account = await this.getDocumentById<Pick<Account, 'tokens'>>(id, { projection: { _id: 0, tokens: 1 } })

    if (account == null) {
      return false
    }

    return account.tokens?.accessToken === accessToken
  }

  protected getCollectionName(): string {
    return COLLECTIONS.USERS
  }

  deleteTokensByUserId(userid: Account['_id']){
    const updateFilter = {$unset: {tokens: ''}}

    return this.updateDocumentById(userid, updateFilter)
  }
}