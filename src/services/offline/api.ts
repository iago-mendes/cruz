import { AxiosRequestConfig } from 'axios'

import warningAlert from '../../utils/alerts/warning'
import getDate from '../../utils/getDate'
import db from '../db'
import { offlineRoutes } from './routes'

export const apiHandler = async (config: AxiosRequestConfig) =>
{
	if (!process.browser || !navigator)
		return config

	const method = config.method.toLowerCase()
	const route = config.url
	const body = config.data
	
	const isOffline = !navigator.onLine
	const isRouteAvailableOffline = offlineRoutes(method, route, body)
	const date = getDate()

	if (isOffline && !isRouteAvailableOffline && method !== 'get')
		warningAlert('Esta ação não está disponível offline!')
	if (isOffline && isRouteAvailableOffline)
		await db.table('apiQueue').add({date, config: JSON.stringify(config)})

	return config
}