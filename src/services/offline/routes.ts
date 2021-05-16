import { client } from './controllers/client'
import { request } from './controllers/request'

export function offlineRoutes(method: string, route: string, body: unknown)
{
	let isRouteAvailableOffline = false

	if (compareRoutes('/requests', route) && method === 'post')
	{
		request.create(route, body)
		isRouteAvailableOffline = true
	}
	if (compareRoutes('/requests/:id', route) && method === 'put')
	{
		request.update(route, body)
		isRouteAvailableOffline = true
	}
	if (compareRoutes('/requests/:id', route) && method === 'delete')
	{
		request.remove(route, body)
		isRouteAvailableOffline = true
	}
	
	if (compareRoutes('/clients', route) && method === 'post')
	{
		client.create(route, body)
		isRouteAvailableOffline = true
	}
	if (compareRoutes('/clients/:id', route) && method === 'put')
	{
		client.update(route, body)
		isRouteAvailableOffline = true
	}
	if (compareRoutes('/clients/:id', route) && method === 'delete')
	{
		client.remove(route, body)
		isRouteAvailableOffline = true
	}
	if (compareRoutes('/clients/:client/contacts', route) && method === 'post')
	{
		client.addContact(route, body)
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