import { Navigate } from 'react-router-dom'
import React from 'react'

interface IToken {
  accessToken: string
  refreshToken: string
}

const withAuthRequired = (Component: React.ComponentType) => {
  return function WithAuthRequired(props: any): JSX.Element {
    let tokens: string | IToken | null = localStorage.getItem('token')

    if (tokens) {
      tokens = JSON.parse(tokens) as IToken
      if (tokens.accessToken && tokens.refreshToken) return <Component {...props} />
    }
    return <Navigate to="/login" />
  }
}

export default withAuthRequired
