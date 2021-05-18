import { getRouteParam } from '../../utils/getRouteParam'
import { client } from './controllers/client'
import { request } from './controllers/request'

export function offlineRoutes(method: string, route: string, body: unknown)
{
	let isRouteAvailableOffline = false

	if (method === 'post' && compareRoutes('requests', route))
	{
		request.create(body)
		isRouteAvailableOffline = true
	}
	if (method === 'put' && compareRoutes('requests/:id', route))
	{
		const id = getRouteParam('requests/:id', route, 'id')
		request.update(body, id)
		isRouteAvailableOffline = true
	}
	if (method === 'delete' && compareRoutes('requests/:id', route))
	{
		const id = getRouteParam('requests/:id', route, 'id')
		request.remove(id)
		isRouteAvailableOffline = true
	}
	
	if (method === 'post' && compareRoutes('clients', route))
	{
		client.create(body)
		isRouteAvailableOffline = true
	}
	if (method === 'put' && compareRoutes('clients/:id', route))
	{
		const id = getRouteParam('clients/:id', route, 'id')
		client.update(body, id)
		isRouteAvailableOffline = true
	}
	if (method === 'delete' && compareRoutes('clients/:id', route))
	{
		const id = getRouteParam('clients/:id', route, 'id')
		client.remove(id)
		isRouteAvailableOffline = true
	}
	if (method === 'post' && compareRoutes('clients/:client/contacts', route))
	{
		const id = getRouteParam('clients/:client/contacts', route, 'id')
		client.addContact(body, id)
		isRouteAvailableOffline = true
	}

	return isRouteAvailableOffline
}

function compareRoutes(pattern: string, route: string)
{
	const patternParts = pattern.split('/')
	const routeParts = route.split('/')

	if (patternParts.length !== routeParts.length)
		return false
	
	let isValid = true
	patternParts.forEach((patternPart, index) =>
	{
		const routePart = routeParts[index]

		if (!patternPart.includes(':') && patternPart !== routePart)
			isValid = false
	})

	return isValid
}