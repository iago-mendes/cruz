import axios from 'axios'
import getConfig from 'next/config'
import {apiHandler} from './offline/apiHandler'

const {publicRuntimeConfig: env} = getConfig()

export const apiUrl = String(env.apiUrl)

let token: string | undefined

try {
	token = localStorage.getItem('token')
} catch (error) {
	token = undefined
}

const api = axios.create({
	baseURL: apiUrl,
	headers: {
		key: env.apiKey,
		authorization: `Bearer ${token}`
	}
})

api.interceptors.request.use(apiHandler)

export default api
