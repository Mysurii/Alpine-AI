import { Request, Response } from 'express'

export type HTTP_STATE = {
  code: number
  status: string
}

export type MessageResponse = { message: string }

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
}
