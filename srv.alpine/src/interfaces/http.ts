export type HTTP_STATE = {
  status: number
  type: string
}

export type HTTP_STATUS = 'ok' | 'created' | 'no_content' | 'bad_request' | 'unauthorized' | 'not_found' | 'internal_server'
