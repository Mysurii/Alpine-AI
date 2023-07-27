import type { BaseModel } from './baseModel'

export type Intent = BaseModel & {
  tag: string
  patterns: string[]
  responses: [
    [
      {
        type: string
        text: string
        tag?: string
      }
    ]
  ]
  followUpQuestions: string[]
  chatbotId: BaseModel['_id']
}
