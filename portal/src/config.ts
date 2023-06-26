const { VITE_API_ENDPOINT } = import.meta.env

if (VITE_API_ENDPOINT === undefined) throw Error('Please provide an api endpoint.')

const envVariables: { api_endpoint: string } = {
  api_endpoint: VITE_API_ENDPOINT,
}

export default envVariables
