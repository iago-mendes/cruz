import db from '.'
import ClientRaw from '../../models/client'
import CompanyRaw from '../../models/company'
import RequestRaw from '../../models/request'
import { SellerRaw } from '../../models/seller'
import api from '../api'

export async function synchronize()
{
	await getData()
}

async function getData()
{
	const {data: companies}:{data: CompanyRaw[]} = await api.get('companies/raw')
	await db.table('companies').bulkAdd(companies)

	const {data: clients, headers: clientsHeaders}:{data: ClientRaw[], headers: any} = await api.get('clients-raw')
	await db.table('clients').bulkAdd(clients)

	const clientsTotalPages = Number(clientsHeaders['total-pages'])
	for (let clientPage = 2; clientPage <= clientsTotalPages; clientPage++)
	{
		const data =
		{
			page: clientPage
		}

		const {data: clients}:{data: ClientRaw[]} = await api.get('clients-raw', {data})
		await db.table('clients').bulkAdd(clients)
	}

	const {data: sellers}:{data: SellerRaw[]} = await api.get('sellers-raw')
	await db.table('sellers').bulkAdd(sellers)

	const {data: requests}:{data: RequestRaw[]} = await api.get('requests-raw')
	await db.table('requests').bulkAdd(requests)
}