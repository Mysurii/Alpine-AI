import type { Request, Response, NextFunction } from 'express'
// import type { methods } from './types/http'

type EndpointSpecifier = {
  endpoint: RegExp | string
  methods: Array<methods>
}

// type RoleSpecificEndpoint = Pick<EndpointSpecifier, 'endpoint' | 'methods'> & {
//   role: Account['role']
// }

// export default function authMiddleware(request: Request, response: Response, next: NextFunction) {
//   const found =
// }
