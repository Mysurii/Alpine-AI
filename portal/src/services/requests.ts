import envVariables from '../config'
import { api } from './interceptor'
import { AxiosResponse, AxiosError } from 'axios'

function handleResponse(err: any): void {
  if (err.response?.data?.message) {
    throw new Error(err.response.data.message as string)
  }
  throw new Error('Something went wrong..')
}

export async function get(uri: string, params?: object): Promise<AxiosResponse | undefined> {
  try {
    const response = await api.get(`${envVariables.api_endpoint}/${uri}`, params)
    return response
  } catch (err: any) {
    handleResponse(err)
  }
}

export async function post(uri: string, payload: object, params?: object): Promise<AxiosResponse | undefined> {
  try {
    const response = await api.post(`${envVariables.api_endpoint}/${uri}`, payload, params)
    return response
  } catch (err: any) {
    handleResponse(err)
  }
}

export async function put(uri: string, payload: object, params?: object): Promise<AxiosResponse | undefined> {
  try {
    return await api.put(`${envVariables.api_endpoint}/${uri}`, payload, params)
  } catch (err) {
    const errorResponse = err as AxiosError
    if (typeof errorResponse.response !== 'undefined' && 'data' in errorResponse.response) {
      return errorResponse.response
    }

    handleResponse(err)
  }
}
export async function patch(uri: string, payload: object, params?: object): Promise<AxiosResponse | undefined> {
  try {
    return await api.patch(`${envVariables.api_endpoint}/${uri}`, payload, params)
  } catch (err) {
    const errorResponse = err as AxiosError
    if (typeof errorResponse.response !== 'undefined' && 'data' in errorResponse.response) {
      return errorResponse.response
    }

    handleResponse(err)
  }
}

export async function deleteRq(uri: string, params?: object): Promise<AxiosResponse | undefined> {
  try {
    return await api.delete(`${envVariables.api_endpoint}/${uri}`, params)
  } catch (err) {
    handleResponse(err)
  }
}

export const request = async <Payload, Data>(type: 'GET' | 'POST', uri: string, payload?: Payload): Promise<AxiosResponse<Data>> => {
  if (type === 'GET') {
    return await api.post(`${envVariables.api_endpoint}/${uri}`)
  }
  if (type === 'POST') {
    return await api.post(`${envVariables.api_endpoint}/${uri}`, payload)
  }
  throw new Error('Invalid request type')
}

export default {
  get,
  post,
}
