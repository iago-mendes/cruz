import axios from 'axios'
import getConfig from 'next/config'
import { apiHandler } from './offline/api'

const {publicRuntimeConfig: env} = getConfig()

export const apiUrl = String(env.apiUrl)

const api = axios.create(
	{
		baseURL: apiUrl,
		headers:
		{
			key: env.apiKey
		}
	}
)

api.interceptors.request.use(apiHandler)

export default api