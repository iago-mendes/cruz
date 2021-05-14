import ClientRaw, { ClientListed } from '../../models/client'
import api from '../api'
import db from '../db'

export async function getRawClients(page?: number)
{
	const query =
	{
		page
	}

	const cached: ClientRaw[] = await db.table('clients').orderBy('nome_fantasia').toArray()
	if (cached && cached.length > 0)
	{
		const clientsPerPage = 15
		const startIndex = (page-1) * clientsPerPage
		const paginated = cached.slice(startIndex, startIndex + clientsPerPage)
		return paginated
	}

	const {data}:{data: ClientRaw[]} = await api.get('clients-raw', {data: query})

	return data
}

export async function getRawClient(id: string)
{
	const cached: ClientRaw = await db.table('clients').get(id)
	if (cached)
		return cached

	const {data}:{data: ClientRaw} = await api.get(`clients-raw/${id}`)

	return data
}

export async function listClients(page?: number, search?: string): Promise<
{
	data: ClientListed[]
	paginate:
	{
		page: number
		totalPages: number
	}
}>
{
	const query =
	{
		page,
		search
	}

	const cached: ClientRaw[] = (await db.table('clients').orderBy('nome_fantasia').toArray())
		.filter((client: ClientRaw) =>
		{
			if (!search || search === '')
				return true
			
			return client.nome_fantasia.search(search) || client.razao_social.search(search) || client.endereco.cidade.search(search)
		})
	
	if (cached && cached.length > 0)
	{
		const clientsPerPage = 15
		const startIndex = (page-1) * clientsPerPage
		const paginated = cached.slice(startIndex, startIndex + clientsPerPage)

		const totalPages = Math.ceil(cached.length / clientsPerPage)

		return {
			data: paginated.map(client => (
				{
					id: client._id,
					razao_social: client.razao_social,
					nome_fantasia: client.nome_fantasia,
					imagem: client.imagem,
					status: client.status
				})),
			paginate:
				{
					page,
					totalPages
				}
		}
	}

	const {data, headers}:{data: ClientRaw[], headers: any} = await api.get('clients-raw', {data: query})
	const totalPages = Number(headers['total-pages'])

	return {
		data: data.map(client => (
			{
				id: client._id,
				razao_social: client.razao_social,
				nome_fantasia: client.nome_fantasia,
				imagem: client.imagem,
				status: client.status
			})),
		paginate:
			{
				page,
				totalPages
			}
	}
}