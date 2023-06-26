interface IIntent {
  tag: string
  patterns: string[]
  responses:
    | [
        [
          {
            type: string
            text: string
            tag?: string
          }
        ]
      ]
    | []
  followUpQuestions: string[]
  chatbotId: string
}

export default IIntent
