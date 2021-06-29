import {getRouteParam} from '../../utils/getRouteParam'
import {clientController} from './controllers/client'
import {companyController} from './controllers/company'
import {goalController} from './controllers/goal'
import {productController} from './controllers/product'
import {productSheetController} from './controllers/productSheet'
import {requestController} from './controllers/request'
import {sellerController} from './controllers/seller'

export function offlineRoutes(method: string, route: string, body: unknown) {
	let isRouteAvailableOffline = false

	if (method === 'post' && compareRoutes('requests', route)) {
		requestController.create(body)
		isRouteAvailableOffline = true
	}
	if (method === 'put' && compareRoutes('requests/:id', route)) {
		const id = getRouteParam('requests/:id', route, 'id')
		requestController.update(body, id)
		isRouteAvailableOffline = true
	}
	if (method === 'delete' && compareRoutes('requests/:id', route)) {
		const id = getRouteParam('requests/:id', route, 'id')
		requestController.remove(id)
		isRouteAvailableOffline = true
	}

	if (method === 'post' && compareRoutes('clients', route)) {
		clientController.create(body)
		isRouteAvailableOffline = true
	}
	if (method === 'put' && compareRoutes('clients/:id', route)) {
		const id = getRouteParam('clients/:id', route, 'id')
		clientController.update(body, id)
		isRouteAvailableOffline = true
	}
	if (method === 'delete' && compareRoutes('clients/:id', route)) {
		const id = getRouteParam('clients/:id', route, 'id')
		clientController.remove(id)
		isRouteAvailableOffline = true
	}
	if (method === 'post' && compareRoutes('clients/:client/contacts', route)) {
		const id = getRouteParam('clients/:client/contacts', route, 'id')
		clientController.addContact(body, id)
		isRouteAvailableOffline = true
	}

	if (method === 'post' && compareRoutes('companies', route)) {
		companyController.create(body)
		isRouteAvailableOffline = true
	}
	if (method === 'put' && compareRoutes('companies/:id', route)) {
		const id = getRouteParam('companies/:id', route, 'id')
		companyController.update(body, id)
		isRouteAvailableOffline = true
	}
	if (method === 'delete' && compareRoutes('companies/:id', route)) {
		const id = getRouteParam('companies/:id', route, 'id')
		companyController.remove(id)
		isRouteAvailableOffline = true
	}
	if (method === 'put' && compareRoutes('companies/:id/tables', route)) {
		const id = getRouteParam('companies/:id/tables', route, 'id')
		companyController.updateTables(body, id)
		isRouteAvailableOffline = true
	}

	if (method === 'post' && compareRoutes('sellers', route)) {
		sellerController.create(body)
		isRouteAvailableOffline = true
	}
	if (method === 'put' && compareRoutes('sellers/:id', route)) {
		const id = getRouteParam('sellers/:id', route, 'id')
		sellerController.update(body, id)
		isRouteAvailableOffline = true
	}
	if (method === 'delete' && compareRoutes('sellers/:id', route)) {
		const id = getRouteParam('sellers/:id', route, 'id')
		sellerController.remove(id)
		isRouteAvailableOffline = true
	}

	if (
		method === 'post' &&
		compareRoutes('companies/:companyId/products', route)
	) {
		const companyId = getRouteParam(
			'companies/:companyId/products/:productId',
			route,
			'companyId'
		)
		productController.create(body, companyId)
		isRouteAvailableOffline = true
	}
	if (
		method === 'put' &&
		compareRoutes('companies/:companyId/products/:productId', route)
	) {
		const companyId = getRouteParam(
			'companies/:companyId/products/:productId',
			route,
			'companyId'
		)
		const productId = getRouteParam(
			'companies/:companyId/products/:productId',
			route,
			'productId'
		)
		productController.update(body, companyId, productId)
		isRouteAvailableOffline = true
	}
	if (
		method === 'delete' &&
		compareRoutes('companies/:companyId/products/:productId', route)
	) {
		const companyId = getRouteParam(
			'companies/:companyId/products/:productId',
			route,
			'companyId'
		)
		const productId = getRouteParam(
			'companies/:companyId/products/:productId',
			route,
			'productId'
		)
		productController.remove(companyId, productId)
		isRouteAvailableOffline = true
	}

	if (
		method === 'post' &&
		compareRoutes('sheet/companies/:companyId/products', route)
	) {
		const companyId = getRouteParam(
			'sheet/companies/:companyId/products',
			route,
			'companyId'
		)
		productSheetController.setProducts(body, companyId)
		isRouteAvailableOffline = true
	}

	if (method === 'post' && compareRoutes('goals', route)) {
		goalController.create(body)
		isRouteAvailableOffline = true
	}
	if (method === 'put' && compareRoutes('goals/:month', route)) {
		const month = getRouteParam('goals/:month', route, 'month')
		goalController.update(body, month)
		isRouteAvailableOffline = true
	}
	if (method === 'delete' && compareRoutes('goals/:month', route)) {
		const month = getRouteParam('goals/:month', route, 'month')
		goalController.remove(month)
		isRouteAvailableOffline = true
	}

	return isRouteAvailableOffline
}

function compareRoutes(pattern: string, route: string) {
	const patternParts = pattern.split('/')
	const routeParts = route.split('/')

	if (patternParts.length !== routeParts.length) return false

	let isValid = true
	patternParts.forEach((patternPart, index) => {
		const routePart = routeParts[index]

		if (!patternPart.includes(':') && patternPart !== routePart) isValid = false
	})

	return isValid
}
