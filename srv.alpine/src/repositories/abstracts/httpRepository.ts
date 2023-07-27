import type { SuperAgentRequest } from 'superagent'
import superagent from 'superagent'

abstract class HTTPRepository {

  abstract baseUrl: string

  protected async get<T>(uri: string, queries?: Record<string, string>) {
    let request: SuperAgentRequest = superagent.get(this.buildUrl(uri))

    if (typeof queries !== 'undefined') request = request.query(queries)

    return this.handleResponse<T>(request)
  }

  protected async post<T>(uri: string, body?: string|object|undefined) {
    let request: SuperAgentRequest = superagent.post(`${this.baseUrl}${uri}`)

    if (typeof body !== 'undefined') request = request.send(body)

    return this.handleResponse<T>(request)
  }

  protected async put<T>(uri: string, body?: string|object|undefined) {
    let request: SuperAgentRequest = superagent.put(this.buildUrl(uri))

    if (typeof body !== 'undefined') request = request.send(body)

    return this.handleResponse<T>(request)
  }

  protected async patch<T>(uri: string, body?: string|object|undefined) {
    let request: SuperAgentRequest = superagent.patch(this.buildUrl(uri))

    if (typeof body !== 'undefined') request = request.send(body)

    return this.handleResponse<T>(request)
  }

  protected async delete<T>(uri: string) {
    return this.handleResponse<T>(superagent.delete(this.buildUrl(uri)))
  }

  protected async head(uri: string) {
    return this.handleResponse(superagent.head(this.buildUrl(uri)))
  }

  private async handleResponse<T>(request: SuperAgentRequest): Promise<{ body: T, statusCode: number }> {
    const response = await request

    return { body: response.body as T, statusCode: response.status }
  }

  private buildUrl(uri: string, queries?: Record<string, string>): string {
    const queryString = typeof queries === 'undefined'
      ? ''
      : Object.entries(queries)
        .map(([key, value]) => {
          return `${key}=${value}`
        }).join('&')

    return `${this.baseUrl}${uri}?${queryString !== '' ? `?${queryString}` : ''}`
  }
}

export default HTTPRepository