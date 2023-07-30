import { UserSchema } from '@api/auth/validators/auth.validator'
import Account from './account.model'
import AuthRepository from './auth.repository'
import ValidationError from '@common/helpers/errors/validation.error'
import bcrypt from 'bcrypt'
import AlreadyExists from '@common/helpers/errors/already-exists.error'
import { LoginRequest, TokenPayload, TokenType, Tokens } from './types/loginRequest'
import NotFound from '@common/helpers/errors/notFound'
import ServerError from '@common/helpers/errors/server-error'
import { envVariables } from '@config/variables'
import jwt, { JwtPayload } from 'jsonwebtoken'
import BadRequest from '@common/helpers/errors/badrequest'

export default class AuthService {
  private authRepository: AuthRepository

  constructor() {
    this.authRepository = new AuthRepository()
  }

  findUser = async (email: string): Promise<Account | null> => {
    const user = await this.authRepository.findByEmail(email)
    return user
  }

  findById = async (id: string): Promise<Account | null> => {
    const user = await this.authRepository.findOne(id)
    return user
  }

  createUser = async (user: UserSchema): Promise<Account> => {
    try {
      UserSchema.parse(user)
    } catch (err: unknown) {
      throw new ValidationError('Provide a valid user')
    }

    const foundUser = await this.findUser(user.email)

    if (foundUser) throw new AlreadyExists('User already exists.')

    const account = user as Account
    account.password = await bcrypt.hash(account.password, 10)

    try {
      const user = await this.authRepository.create(account)
      return user
    } catch (err: unknown) {
      throw new ServerError('Something went wrong while creating your account.')
    }
  }

  updateUser = async (user: Account): Promise<boolean> => {
    const updated = await this.authRepository.update(user._id, user)
    return updated
  }

  isPasswordMatching = async (user: Account, password: string) => {
    return await bcrypt.compare(password, user.password)
  }

  generateTokens = (payload: Pick<TokenPayload, '_id' | 'role'>): Tokens => {
    const accessToken = jwt.sign({ ...payload, type: 'at' } satisfies TokenPayload, envVariables.TOKENS.atPrivateKey, { expiresIn: '15m' })
    const refreshToken = jwt.sign({ ...payload, type: 'rt' } satisfies TokenPayload, envVariables.TOKENS.rtPrivateKey, { expiresIn: '30d' })
    return { accessToken, refreshToken } satisfies Tokens
  }

  verifyToken = (token: string, tokenType: TokenType): JwtPayload | string => {
    const key = tokenType === 'at' ? envVariables.TOKENS.atPrivateKey : envVariables.TOKENS.rtPrivateKey

    try {
      return jwt.verify(token, key)
    } catch {
      throw new BadRequest('Invalid or expired token!')
    }
  }
}
