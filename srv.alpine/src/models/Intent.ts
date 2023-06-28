export type Intent = {
  tag: string
  patterns: string[]
  responses: Array<Response[]>
  followUpQuestions?: string[]
}

type Response = {
  type: string
  text: string
  tag?: string
}
