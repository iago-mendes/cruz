import { client } from './controllers/client'
import { request } from './controllers/request'

export function offlineRoutes(method: string, route: string, body: unknown)
{
	let isRouteAvailableOffline = false

	if (method === 'post' && compareRoutes('requests', route))
	{
		request.create(route, body)
		isRouteAvailableOffline = true
	}
	if (method === 'put' && compareRoutes('requests/:id', route))
	{
		request.update(route, body)
		isRouteAvailableOffline = true
	}
	if (method === 'delete' && compareRoutes('requests/:id', route))
	{
		request.remove(route, body)
		isRouteAvailableOffline = true
	}
	
	if (method === 'post' && compareRoutes('clients', route))
	{
		client.create(route, body)
		isRouteAvailableOffline = true
	}
	if (method === 'put' && compareRoutes('clients/:id', route))
	{
		client.update(route, body)
		isRouteAvailableOffline = true
	}
	if (method === 'delete' && compareRoutes('clients/:id', route))
	{
		client.remove(route, body)
		isRouteAvailableOffline = true
	}
	if (method === 'post' && compareRoutes('clients/:client/contacts', route))
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