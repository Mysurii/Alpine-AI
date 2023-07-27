import { ObjectID } from 'bson'
import { env_variables } from '../../../src/config'
import { decryptData, encryptData, generateId, generatePublicPrivateKey, hashPassword, isValidId, parseId, samePassword } from '../../../src/util/util'
import validator from 'validator'
import crypto from 'crypto'

describe('Hash password', () => {
  const password = 'hello world'

  it('Successfully hash password', async () => {
    const hashed = await hashPassword(password)

    expect(hashed).not.toEqual(password)
  })

  it('Valid password validation', async () => {
    const hashed = await hashPassword(password)

    expect(hashed).not.toEqual(password)

    expect(await samePassword(password, hashed)).toBeTruthy()
  })

  it('Invalid password validation', async () => {
    const hashed = await hashPassword(password)

    expect(hashed).not.toEqual(password)

    expect(await samePassword('Not the same password', hashed)).toBeFalsy()
  })
})

describe('ID parsing/validation', () => {
  it('Generate valid ID', () => {
    const id = generateId()
    if (env_variables.ID_TYPE === 'ObjectID') {
      // ObjectID generation
      expect(id).toBeInstanceOf(ObjectID)
    } else {
      // UUID generation
      expect(validator.isUUID(id.toString())).toBeTruthy()
    }
  })

  it('Validate ID', () => {
    const id = generateId()

    expect(isValidId(id)).toBeTruthy()

    // text 'not valid' is neither a valid ObjectId not UUID
    expect(isValidId('not valid')).toBeFalsy()

    if (env_variables.ID_TYPE === 'ObjectID') {
      expect(isValidId(new ObjectID())).toBeTruthy()
    } else {
      // UUID validation
      expect(isValidId(crypto.randomUUID())).toBeTruthy()
    }
  })

  it('Parse ID', () => {
    if (env_variables.ID_TYPE === 'ObjectID') {
      const id = new ObjectID()
      // ObjectID parsing
      expect(parseId(id)).toBeInstanceOf(ObjectID)

      expect(parseId(id.toString())).toBeInstanceOf(ObjectID)
    } else {
      const uuid = generateId()
      // UUID parsing
      expect(parseId(uuid)).toBe(uuid)
    }
  })
})

describe('Public/Private key tests', () => {
  it('Generate keypair', () => {
    const { publicKey, privateKey } = generatePublicPrivateKey()

    expect(publicKey).toBeDefined()
    expect(privateKey).toBeDefined()
  })

  it('Encrypt data', () => {
    const data = { hello: 'world' }

    const stringified = JSON.stringify(data)

    const { publicKey } = generatePublicPrivateKey()

    const encrypted = encryptData(publicKey, stringified, 'buffer')

    expect(encrypted.toString()).not.toBe(stringified)
  })

  it('Decrypt data', () => {
    const data = { hello: 'world' }

    const stringified = JSON.stringify(data)

    const { publicKey, privateKey } = generatePublicPrivateKey()

    const encrypted = encryptData(publicKey, stringified, 'buffer')

    const decrypted = decryptData(privateKey, encrypted)

    expect(decrypted).toBe(stringified)
  })
})