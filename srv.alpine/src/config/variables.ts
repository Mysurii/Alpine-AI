const { PORT, DATABASE_URL, ACCESS_TOKEN_PRIVATE_KEY, REFRESH_TOKEN_PRIVATE_KEY, AI_SERVER_URL } = process.env

if (DATABASE_URL === undefined) {
  throw Error('Database variables not set!')
}

if (ACCESS_TOKEN_PRIVATE_KEY === undefined || REFRESH_TOKEN_PRIVATE_KEY === undefined) throw Error('Token variables are not set!')

if (AI_SERVER_URL === undefined) throw Error('AI server url variable not set!')

type EnvVariables = {
  PORT: number
  DATABASE_URL: string
  TOKENS: {
    atPrivateKey: string
    rtPrivateKey: string
  }
}

export const envVariables = {
  PORT: PORT ? parseInt(PORT) : 8000,
  DATABASE_URL,
  TOKENS: {
    atPrivateKey: ACCESS_TOKEN_PRIVATE_KEY,
    rtPrivateKey: REFRESH_TOKEN_PRIVATE_KEY,
  },
} satisfies EnvVariables
