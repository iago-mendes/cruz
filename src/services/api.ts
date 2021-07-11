import axios from 'axios'
import {apiHandler} from './offline/apiHandler'

export const apiUrl = String(process.env.NEXT_PUBLIC_API_URL)

let token: string | undefined

try {
	token = localStorage.getItem('token')
} catch (error) {
	token = undefined
}

const api = axios.create({
	baseURL: apiUrl,
	headers: {
		key: process.env.NEXT_PUBLIC_API_KEY,
		authorization: `Bearer ${token}`
	}
})

api.interceptors.request.use(apiHandler)

export default api
