import { get, set } from 'idb-keyval'

import api from './api'

export async function getData(route: string, refresh = false)
{
	const cached = await get(route)
	if (cached != undefined && !refresh)
		return cached

	const {data} = await api.get(route)
	set(route, data)

	return data
}