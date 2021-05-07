import Client from '../../models/client'
import api from '../api'

export async function getRawClients(page?: number)
{
	const query =
	{
		page
	}

	const {data}:{data: Client[]} = await api.get('clients-raw', {data: query})

	return data
}

export async function getRawClient(id: string)
{
	const {data}:{data: Client} = await api.get(`clients-raw/${id}`)

	return data
}