import { getRouteParam } from '../../utils/getRouteParam'
import { clientController } from './controllers/client'
import { companyController } from './controllers/company'
import { requestController } from './controllers/request'
import { sellerController } from './controllers/seller'

export function offlineRoutes(method: string, route: string, body: unknown)
{
	let isRouteAvailableOffline = false

	if (method === 'post' && compareRoutes('requests', route))
	{
		requestController.create(body)
		isRouteAvailableOffline = true
	}
	if (method === 'put' && compareRoutes('requests/:id', route))
	{
		const id = getRouteParam('requests/:id', route, 'id')
		requestController.update(body, id)
		isRouteAvailableOffline = true
	}
	if (method === 'delete' && compareRoutes('requests/:id', route))
	{
		const id = getRouteParam('requests/:id', route, 'id')
		requestController.remove(id)
		isRouteAvailableOffline = true
	}
	
	if (method === 'post' && compareRoutes('clients', route))
	{
		clientController.create(body)
		isRouteAvailableOffline = true
	}
	if (method === 'put' && compareRoutes('clients/:id', route))
	{
		const id = getRouteParam('clients/:id', route, 'id')
		clientController.update(body, id)
		isRouteAvailableOffline = true
	}
	if (method === 'delete' && compareRoutes('clients/:id', route))
	{
		const id = getRouteParam('clients/:id', route, 'id')
		clientController.remove(id)
		isRouteAvailableOffline = true
	}
	if (method === 'post' && compareRoutes('clients/:client/contacts', route))
	{
		const id = getRouteParam('clients/:client/contacts', route, 'id')
		clientController.addContact(body, id)
		isRouteAvailableOffline = true
	}

	if (method === 'post' && compareRoutes('companies', route))
	{
		companyController.create(body)
		isRouteAvailableOffline = true
	}
	if (method === 'put' && compareRoutes('companies/:id', route))
	{
		const id = getRouteParam('companies/:id', route, 'id')
		companyController.update(body, id)
		isRouteAvailableOffline = true
	}
	if (method === 'delete' && compareRoutes('companies/:id', route))
	{
		const id = getRouteParam('companies/:id', route, 'id')
		companyController.remove(id)
		isRouteAvailableOffline = true
	}

	if (method === 'post' && compareRoutes('sellers', route))
	{
		sellerController.create(body)
		isRouteAvailableOffline = true
	}
	if (method === 'put' && compareRoutes('sellers/:id', route))
	{
		const id = getRouteParam('sellers/:id', route, 'id')
		sellerController.update(body, id)
		isRouteAvailableOffline = true
	}
	if (method === 'delete' && compareRoutes('sellers/:id', route))
	{
		const id = getRouteParam('sellers/:id', route, 'id')
		sellerController.remove(id)
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