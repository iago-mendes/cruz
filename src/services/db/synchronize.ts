import db from '.'
import ClientRaw from '../../models/client'
import CompanyRaw from '../../models/company'
import RequestRaw from '../../models/request'
import { SellerRaw } from '../../models/seller'
import api from '../api'

export async function synchronize(setLoading: (loading: boolean) => void)
{
	setLoading(true)

	await getData()

	setLoading(false)
}

async function getData()
{
	const {data: companies}:{data: CompanyRaw[]} = await api.get('companies/raw')
	const promise1 = companies.map(async company =>
	{
		const existingCompany = await db.table('companies').get(company._id)

		if (existingCompany)
			await db.table('companies').put(company)
		else
			await db.table('companies').add(company)
	})
	await Promise.all(promise1)

	let clientsTotalPages = 2
	for (let clientPage = 1; clientPage <= clientsTotalPages; clientPage++)
	{
		const data =
		{
			page: clientPage
		}
		
		const {data: clients, headers: clientsHeaders}:{data: ClientRaw[], headers: any} = await api.get('clients-raw', {data})
		clientsTotalPages = Number(clientsHeaders['total-pages'])

		const tmpPromise = clients.map(async client =>
		{
			const existingClient = await db.table('clients').get(client._id)
	
			if (existingClient)
				await db.table('clients').put(client)
			else
				await db.table('clients').add(client)
		})
		await Promise.all(tmpPromise)
	}

	const {data: sellers}:{data: SellerRaw[]} = await api.get('sellers-raw')
	const promise2 = sellers.map(async seller =>
	{
		const existingSeller = await db.table('sellers').get(seller._id)

		if (existingSeller)
			await db.table('sellers').put(seller)
		else
			await db.table('sellers').add(seller)
	})
	await Promise.all(promise2)

	const {data: requests}:{data: RequestRaw[]} = await api.get('requests-raw')
	const promise3 = requests.map(async request =>
	{
		const existingRequest = await db.table('requests').get(request._id)

		if (existingRequest)
			await db.table('requests').put(request)
		else
			await db.table('requests').add(request)
	})
	await Promise.all(promise3)
}