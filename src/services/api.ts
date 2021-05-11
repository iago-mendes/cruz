import axios from 'axios'
import getConfig from 'next/config'

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

export default api