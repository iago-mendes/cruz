export function getRouteParam(routePattern: string, route: string, param: string)
{
	const routePatternParts = routePattern.split('/')
	const routeParts = route.split('/')

	if (routePatternParts.length !== routeParts.length)
		return undefined
	
	const paramIndex = routePatternParts.findIndex(part => part === `:${param}`)
	if (paramIndex < 0)
		return undefined
	
	const paramValue = routeParts[paramIndex]

	return paramValue
}