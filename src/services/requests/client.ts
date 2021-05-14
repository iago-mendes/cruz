import Client from '../../models/client'
import api from '../api'
import db from '../db'

export async function getRawClients(page?: number)
{
	const query =
	{
		page
	}

	const cached: Client[] = await db.table('clients').orderBy('nome_fantasia').toArray()
	if (cached && cached.length > 0)
	{
		const clientsPerPage = 15
		const startIndex = (page-1) * clientsPerPage
		const paginated = cached.slice(startIndex, startIndex + clientsPerPage)
		return paginated
	}

	const {data}:{data: Client[]} = await api.get('clients-raw', {data: query})

	return data
}

export async function getRawClient(id: string)
{
	const cached: Client = await db.table('clients').get(id)
	if (cached)
		return cached

	const {data}:{data: Client} = await api.get(`clients-raw/${id}`)

	return data
}