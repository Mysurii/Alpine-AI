import { Request, Response, NextFunction, RequestHandler } from 'express'

export function RouteWrapper(route: (req: Request, res: Response, next: NextFunction) => Promise<Response | void>): RequestHandler {
  return async (request: Request, response: Response, next: NextFunction) => {
    try {
      // the request queries can only be retrieved when the route is called
      return await route(request, response, next)
    } catch (err: unknown) {
      next(err)
    }
  }
}
