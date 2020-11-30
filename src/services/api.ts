import axios from 'axios'
import getConfig from 'next/config'

const {publicRuntimeConfig: env} = getConfig()

const api = axios.create(
{
	baseURL: env.apiUrl,
	headers:
	{
		key: env.apiKey
	}
})

export default api