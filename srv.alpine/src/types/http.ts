export type MessageResponse = { message: string }

export type HTTP_STATE = {
  code: number
  status: string
}

type HTTP_STATUS_CODE =
  | 'ok'
  | 'created'
  | 'accepted'
  | 'no_content'
  | 'bad_request'
  | 'unauthorized'
  | 'not_found'
  | 'internal_server'

export const HTTP_STATUS: Record<Uppercase<HTTP_STATUS_CODE>, HTTP_STATE> = {
  OK: { code: 200, status: 'OK' },
  CREATED: { code: 201, status: 'Created' },
  ACCEPTED: { code: 202, status: 'Accepted' },
  NO_CONTENT: { code: 204, status: 'No Content' },
  BAD_REQUEST: { code: 400, status: 'Bad Request' },
  UNAUTHORIZED: { code: 401, status: 'Unauthorized' },
  NOT_FOUND: { code: 404, status: 'Not Found' },
  INTERNAL_SERVER: { code: 500, status: 'Internal Server Error' },
}

export type methods = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'HEAD' | 'PATCH' | '*'
