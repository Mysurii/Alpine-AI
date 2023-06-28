export type Intent = {
  tag: string
  patterns: string[]
  responses: [
    [
      {
        type: string
        text: string
        tag?: string
      },
    ],
  ]
  followUpQuestions: string[]
}
