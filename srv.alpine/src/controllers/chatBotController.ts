import type {Request, Response} from 'express'
import {Router} from 'express'
import type {$MatchFindOption} from 'mongodb-helper'
import {
  ApiErrorResponse,
  ApiException,
  AsyncRouteWrapper, INVALID_REQUEST_PARAMETER,
  INVALID_VALUE,
  MISSING_BODY,
  NOT_FOUND
} from '../exceptions/exceptions'
import type {Chatbot, ChatBotKeys, CreateChatbot} from '../models/chatbot'
import {getAIRepository, getChatbotRepository} from '../repositories/repos'
import type {BodyAttribute} from '../util/endpoint-util'
import {
  getUser,
  HTTP_STATUS,
  bodyAttributesCheck,
  sendError,
  sendResponse,
  getQueryParameters
} from '../util/endpoint-util'
import {encryptData, generateId} from '../util/util'
import intentsJson from '../util/basic_intents.json'
import type {Account} from '../models/authentication'
import {INITIAL_CUSTOMIZATION} from '../models/customization'
import {env_variables} from '../config'

export const ChatBotController: Router = Router()

const chatBotRepository = getChatbotRepository()
const aiRepository = getAIRepository()

// get all chat bots
ChatBotController.get(
  '/',
  AsyncRouteWrapper(async (request: Request, response: Response) => {
    const {name} = request.query as ChatBotKeys

    const user = getUser(request)

    const filter: $MatchFindOption = {}

    if (typeof name === 'string') {
      filter['name'] = {
        $regex: name,
      }
    }

    const bots = await chatBotRepository.getChatbots(user._id, filter)

    sendResponse(response, HTTP_STATUS.OK, bots)
  })
)

// get specific chatbot
ChatBotController.get(
  '/:id',
  AsyncRouteWrapper(async (request: Request, response: Response) => {
    const user = getUser(request)
    const id = request.params.id

    const {fields} = getQueryParameters(request)

    const projection =
            typeof fields === 'string' && fields.length > 0
              ? fields.split(',').reduce((acc, field: string) => {
                acc[field] = 1
                return acc
              }, {} as Record<string, 1 | 0>)
              : undefined

    const chatbot = await getChatbot(user._id, id, projection)

    sendResponse(response, HTTP_STATUS.OK, chatbot)
  })
)

// create chatbot
ChatBotController.post(
  '/',
  AsyncRouteWrapper(async (request: Request, response: Response) => {
    const bodyAttributes: Array<BodyAttribute> = [
      {name: 'name', type: 'string'},
      {name: 'description', type: 'string', optional: true},
    ]

    bodyAttributesCheck(request.body, bodyAttributes)

    const user = getUser(request)

    const {name, description} = request.body as CreateChatbot

    if (name.length < 3) {
      throw INVALID_VALUE('Name needs to be atleast 3 characters')
    }

        type InsertChatbot = CreateChatbot & {
            _id?: Chatbot['_id']
            intents: Chatbot['intents']
            customization: Chatbot['customization']
            createdAt: number
            trained: Chatbot['trained'],
            amountTrained: Chatbot['amountTrained'],
            usage: Chatbot['usage']
        }

        const toCreate: InsertChatbot = {
          _id: generateId(),
          name,
          intents: intentsJson as Chatbot['intents'],
          customization: INITIAL_CUSTOMIZATION as Chatbot['customization'],
          createdAt: new Date().getTime(),
          trained: false,
          usage: [],
          amountTrained: 0
        }

        if (typeof description !== 'undefined') {
          toCreate.description = description
        }

        // create the chatbot

        // check if there are other chatbots with the same name
        const otherNameLookalikes = await chatBotRepository.getChatbots(user._id, {name: {$regex: name}}, {_id: 1})

        if (otherNameLookalikes.length > 0) {
          // change the name so it will be unique, to: e.g. Alpine-AI (1)
          toCreate.name = `${toCreate.name} (${otherNameLookalikes.length})`
        }

        const dbResponse = await chatBotRepository.createChatbot(user._id, toCreate)

        if (dbResponse.acknowledged) {
          return sendResponse(response, HTTP_STATUS.CREATED, toCreate)
        }

        sendError(response, HTTP_STATUS.BAD, 'Something went wrong with creating the chatbot')
  })
)

// train chatbot
ChatBotController.post(
  '/:id/train',
  AsyncRouteWrapper(async (request: Request, response: Response) => {
    const user = getUser(request)
    const chatbotId = request.params.id

    // get chatbot

    const chatbot = await getChatbot(user._id, chatbotId, {_id: 1, trained: 1, intents: 1})

    // chatbot exists

    // if the chatbot has already been trained with the current configuration, re-training has no effect
    if (chatbot.trained) {
      throw new ApiErrorResponse('Chatbot has already been trained, change the intents to be able to re-train it', HTTP_STATUS.BAD)
    }

    if (typeof chatbot.intents === 'undefined' || chatbot.intents.length === 0) {
      throw new ApiErrorResponse('Chatbot has no intents, so it can\'t be trained', HTTP_STATUS.BAD)
    }

    // chatbot has not been trained yet
    // train chatbot

    try {
      const successfullyTrained = await aiRepository.trainChatbot(user._id, chatbot._id)

      if (successfullyTrained) {
        // successfully trained the chatbot
        // set the trained status
        await chatBotRepository.updateChatbotTrainedStatus(user._id, chatbot._id, true)

        return sendResponse(response, HTTP_STATUS.NO_CONTENT)
      }

      return sendResponse(response, HTTP_STATUS.INTERNAL_SERVER, 'Something went wrong with training the chatbot')
    } catch (error) {
      // something went wrong with training the chatbot
      throw new ApiException('Something went wrong with training the chatbot', error as Error)
    }
  })
)

ChatBotController.post('/response', AsyncRouteWrapper(async (request: Request, response: Response) => {
  const bodyAttributes: Array<BodyAttribute> = [{  name: 'message', type: 'string'  }]
  bodyAttributesCheck(request.body, bodyAttributes)

  const user = getUser(request)

  if (typeof request.encryptedToken?.chatbotId === 'undefined') {
    throw INVALID_REQUEST_PARAMETER('Chatbot id not set in access token')
  }

  const chatbotId = request.encryptedToken?.chatbotId
  const {message} = request.body

  // get chatbot
  const chatbot = await getChatbot(user._id, chatbotId, {_id: 1, trained: 1})

  if (!chatbot.trained) {
    throw new ApiErrorResponse('Chatbot not trained', HTTP_STATUS.BAD)
  }

  const chatbotResponse = await aiRepository.getChatbotResponse(user._id, chatbot._id, message)

  await chatBotRepository.incrementChatbotUsage(user._id, chatbot._id)

  return sendResponse(response, HTTP_STATUS.OK, chatbotResponse)
}))

// get chatbot response
ChatBotController.post(
  '/:id/response',
  AsyncRouteWrapper(async (request: Request, response: Response) => {
    const bodyAttributes: Array<BodyAttribute> = [{name: 'message', type: 'string'}]

    bodyAttributesCheck(request.body, bodyAttributes)

    const user = getUser(request)
    const chatbotId = request.params.id

    const {message} = request.body

    // get chatbot
    const chatbot = await getChatbot(user._id, chatbotId, {_id: 1, trained: 1})

    if (!chatbot.trained) {
      throw new ApiErrorResponse('Chatbot not trained', HTTP_STATUS.BAD)
    }

    const chatbotResponse = await aiRepository.getChatbotResponse(user._id, chatbot._id, message)

    await chatBotRepository.incrementChatbotUsage(user._id, chatbot._id)

    return sendResponse(response, HTTP_STATUS.OK, chatbotResponse)
  })
)

// modify chatbot
ChatBotController.patch(
  '/:id',
  AsyncRouteWrapper(async (request: Request, response: Response) => {
    const bodyAttributes: Array<BodyAttribute> = [
      // not all attributes need to be changed, atleast one of these
      { name: 'name', type: 'string', optional: true },
      { name: 'description', type: 'string', optional: true },
    ]

    bodyAttributesCheck(request.body, bodyAttributes)

    const {name, description, intents, customization} = request.body as CreateChatbot
    console.log('body::')
    console.log(request.body)
    if (name === 'undefined' && description === 'undefined') {
      throw MISSING_BODY('Atleast one attribute needs to be changed')
    }

    const user = getUser(request)
    const toChangeId = request.params.id

    const chatbot = await chatBotRepository.getChatbotById(user._id, toChangeId)

    if (chatbot == null) {
      throw NOT_FOUND('Chatbot not found')
    }

    if (typeof name !== 'undefined') {
      if (name.length < 3) {
        throw INVALID_VALUE('Name needs to be atleast 3 characters')
      }

      chatbot.name = name
    }

    if (typeof description !== 'undefined') chatbot.description = description

    let changeTrainedStatus = false

    if (typeof intents !== 'undefined') {
      // if the intents change, the trained status of the chatbot needs to be set to false
      changeTrainedStatus = true
      // map with deconstructing to avoid saving properties that are not meant to be included
      chatbot.intents = intents.map(({tag, patterns, followUpQuestions, responses}) => {
        return {tag, patterns, followUpQuestions, responses}
      })
    }

    console.log(customization)
    if (typeof customization !== 'undefined') {
      chatbot.customization = customization
    }

    if (changeTrainedStatus) {
      chatbot.trained = false
    }

    // console.log(chatbot.customization)

    const dbResponse = await chatBotRepository.updateChatbot(user._id, chatbot)

    // if the request was accepted
    if (dbResponse.acknowledged) {
      return sendResponse(response, HTTP_STATUS.OK, chatbot)
    }

    sendError(response, HTTP_STATUS.INTERNAL_SERVER, 'Something went wrong with updating the chatbot')
  })
)

// delete chatbot
ChatBotController.delete(
  '/:id',
  AsyncRouteWrapper(async (request: Request, response: Response) => {
    const user = getUser(request)
    const chatbotId = request.params.id

    const dbResponse = await chatBotRepository.deleteChatbotById(user._id, chatbotId)

    // if the request was accepted
    if (dbResponse.acknowledged) {
      // if no document has been modified/changed, then there was no valid match found with the chatbots
      if (dbResponse.modifiedCount === 0) {
        return sendError(response, HTTP_STATUS.NOT_FOUND, 'Chatbot not found')
      }

      return sendResponse(response, HTTP_STATUS.NO_CONTENT)
    }

    sendError(response, HTTP_STATUS.INTERNAL_SERVER, 'Something went wrong with deleting the chatbot')
  })
)

ChatBotController.post('/:id/encryptionKey', AsyncRouteWrapper(async (request: Request, response: Response) => {
  const user = getUser(request)
  const chatbotId = request.params.id

  const chatbot = await getChatbot(user._id, chatbotId, {encryptionKey: 1})

  if (chatbot.encryptionKey != null) {
    return sendResponse(response, HTTP_STATUS.OK, {key: chatbot.encryptionKey})
  }

  const toEncrypt = {chatbotId: chatbot._id, userId: user._id}

  const encrypted = encryptData(env_variables.ENCRYPTION_KEYS.PUBLIC, JSON.stringify(toEncrypt), 'string')

  await chatBotRepository.updateEncryptionKey(user._id, chatbot._id, encrypted)

  return sendResponse(response, HTTP_STATUS.OK, {key: encrypted})
}))

async function getChatbot(userid: Account['_id'], chatbotId: Chatbot['_id'], projection?: Record<string, 1 | 0> | undefined): Promise<Chatbot> {
  const chatbot = await chatBotRepository.getChatbotById(userid, chatbotId, projection)

  if (chatbot == null) {
    throw NOT_FOUND('Chatbot not found')
  }

  return chatbot
}
