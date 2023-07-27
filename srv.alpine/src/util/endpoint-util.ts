import type { Request, Response } from 'express'
import { MISSING_BODY, USER_NOT_SET } from '../exceptions/exceptions'

export type HTTP_STATE = {
  code: number,
  status: string
}

export type MessageResponse = {
  message: string
}

type HTTP_STATUS_CODES = 'ok'|'created'|'accepted'|'no_content'|'bad'|'unauthorized'|'not_found'|'conflict'|'internal_server'

export const HTTP_STATUS: Record<Uppercase<HTTP_STATUS_CODES>, HTTP_STATE> = {
  OK: { code: 200, status: 'OK' },
  CREATED: { code: 201, status: 'Created' },
  ACCEPTED: { code: 202, status: 'Accepted' },
  NO_CONTENT: { code: 204, status: 'No Content' },
  BAD: { code: 400, status: 'Bad Request' },
  UNAUTHORIZED: { code: 401, status: 'Unauthorized' },
  NOT_FOUND: { code: 404, status: 'Not Found' },
  CONFLICT: { code: 409, status: 'Conflict' },
  INTERNAL_SERVER: { code: 500, status: 'Internal Server Error' }
}

export function getUser(request: Request) {
  const user = request.user ?? request.encryptedToken?.user

  if (typeof user === 'undefined') {
    throw USER_NOT_SET()
  }

  return user
}

export function sendResponse(response: Response, status: HTTP_STATE, responseBody?: unknown): void {
  response
    .status(status.code)
    .send(responseBody)
}

export function sendError(response: Response, status: HTTP_STATE, message: string) {
  const responseMessage = {
    status: status.code,
    error: status.status,
    message: message
  }

  sendResponse(response, status, responseMessage)
}

export function setNextURL (requestUrl: Request, response: Response, offset: number, limit: number, totalResources: number): void {
  const responseHeaders: { next?: string } = {}
  const newOffset = (offset || 0) + (limit || 10) 

  if (newOffset < totalResources) {
    const url: URL = getFullUrl(requestUrl)

    url.searchParams.set('offset', newOffset.toString())
    // no need to set the limit again

    responseHeaders.next = url.toString()
  }

  if (Object.keys(responseHeaders).length > 0) {
    response.set(responseHeaders)
  }
}

export function getFullUrl (request: Request): URL {
  return new URL(`${request.protocol}://${request.get('host')}${request.originalUrl}`)
}

type BasicAttribute = {
  name: string,
  type: 'string'|'number',
  optional?: boolean,
  enums?: Array<string|number> // value needs to be one of these
}

type ArrayAttribute = Omit<BasicAttribute, 'type'> & {
  type: 'array',
  minimulLength: number,
  elementType: BasicAttribute['type']
}

type ArrayObjectsAttribute = Omit<BasicAttribute, 'type'> & {
  type: 'arrayOfObjects',
  minimulLength: number,
  properties: Array<BodyAttribute>,
}

export type BodyAttribute = BasicAttribute | ArrayAttribute | ArrayObjectsAttribute

// throws exception when not present
export function bodyAttributesCheck(requestBody: Request['body'], requiredAttributes: Array<BodyAttribute>): void {
  for (const properties of requiredAttributes) {
    const bodyAttr = requestBody[properties.name]

    checkAttribute(bodyAttr, properties)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function checkAttribute(bodyAttr: any, properties: BodyAttribute | ArrayAttribute): void {

    const { name, optional, type, enums } = properties

    if (typeof bodyAttr === 'undefined' && typeof optional !== 'undefined' && optional) {
      return
    }

    // if not set and the value isn't optional or optional isn't set, throw exception
    if (typeof bodyAttr === 'undefined') {
      throw MISSING_BODY(`${name} is required`)
    }

    if (type === 'array' || type === 'arrayOfObjects') {
      if (!(bodyAttr instanceof Array)) {
        throw MISSING_BODY(`${name} needs to be of type array`)  
      }

      if (bodyAttr.length !== properties.minimulLength) {
        throw MISSING_BODY(`${name} needs to have a minimum length of ${properties.minimulLength}`)
      }

      if (type === 'array') {
        bodyAttr.forEach(element => {
          typeCheck(`${name} content`, element, properties.elementType)
        })
      } else {
        // array of objects
        bodyAttr.forEach(element => {
          properties.properties.forEach(property => {
            const attribute = element[property.name]
            checkAttribute(attribute, property)
          })
        })
      }
    } else {
      typeCheck(name, bodyAttr, type)
    }

    if (typeof enums !== 'undefined' && !enums.includes(bodyAttr)) {
      throw MISSING_BODY(`${name} needs to be one of the following values: ${enums.join(', ')}`)
    }
  }

  function typeCheck(name: string, value: unknown, requiredType: BasicAttribute['type']) {
    if (typeof value !== requiredType) {
      throw MISSING_BODY(`${name} needs to be of type ${requiredType}`)
    }
  }
}

export function getQueryParameters(request: Request, maxLimit = 10): { offset: number, limit: number } & { [key: string]: string|number } {
  let limit = maxLimit
  let offset = 0

  if (request.query.limit) {
    try {
      limit = parseInt(request.query.limit as string)
    } catch (e) {
      limit = maxLimit
    }
  }

  if (request.query.offset) {
    try {
      offset = parseInt(request.query.offset as string)
    } catch (e) {
      offset = 0
    }
  }

  const response: { offset: number, limit: number, [key: string]: string | number } = { limit, offset }

  // set other non generic query parameters
  Object.keys(request.query).filter(q => q !== 'limit' && q !== 'offset').forEach(query => {
    const val = request.query[query] as string

    try {
      const parsed = parseInt(val)

      if (!isNaN(parsed)) {
        response[query] = parsed
      } else {
        response[query] = val
      }
      
    } catch (e) {
      response[query] = val
    }
  })

  return response
}

export type OrderByParam = { property: string, ascending: 1 | -1 }

export function setOrderByParameters(orderByParam: string, possibleOptions: Array<string> | ReadonlyArray<string> | undefined): Array<OrderByParam> {
  const orderBy: Array<OrderByParam> = []

  let params: Array<string> = []

  if (orderByParam.includes(',')) {
    params = orderByParam.split(',')
  } else {
    params = [ orderByParam ]
  }

  params.forEach(param => {
    if (!param.toString().includes('.')) {
      throw Error('order by is missing the desc or asc option')
    } else {
      const split: Array<string> = param.split('.')

      if ((possibleOptions && !possibleOptions.includes(split[0])) || split[1] !== 'desc' && split[1] !== 'asc') {
        throw Error('order by is not a valid query parameter')
      }

      orderBy.push({ property: split[0], ascending: split[1] === 'asc' ? 1 : -1 })
    }
  })


  return orderBy
}