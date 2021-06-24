import {AxiosRequestConfig} from 'axios'

import warningAlert from '../../utils/alerts/warning'
import {ApiCall} from './ApiCall'
import {offlineRoutes} from './routes'

export const apiHandler = async (axiosConfig: AxiosRequestConfig) => {
	if (!process.browser || !navigator) return axiosConfig

	const apiCall = new ApiCall(axiosConfig)

	const method = apiCall.config.method.toLowerCase()
	const route = apiCall.config.url
	const body = apiCall.config.data

	if (method === 'get') return axiosConfig

	const isOffline = !navigator.onLine
	const isRouteAvailableOffline = offlineRoutes(method, route, body)

	if (isOffline && !isRouteAvailableOffline)
		warningAlert('Esta ação não está disponível offline!')
	if (isOffline && isRouteAvailableOffline) await apiCall.save()

	return axiosConfig
}
