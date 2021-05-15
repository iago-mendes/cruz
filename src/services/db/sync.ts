import db from '.'
import successAlert from '../../utils/alerts/success'
import getDate from '../../utils/getDate'
import api from '../api'

export async function sync(setLoading?: (loading: boolean) => void)
{
	if (setLoading)
		setLoading(true)

	const lastSync = localStorage.getItem('last-sync')
	await getData(lastSync)

	const today = getDate()
	localStorage.setItem('last-sync', today)

	if (setLoading)
	{
		setLoading(false)
		successAlert('Sincronização concluída com sucesso!')
	}
}

async function getData(lastSync?: string)
{
	type SyncId =
	{
		id: string
		modifiedAt: string
	}

	const {data: syncIds}:
	{
		data:
		{
			lastModifiedAt: string
			clients: SyncId[]
			companies: SyncId[]
			requests: SyncId[]
			sellers: SyncId[]
		}
	} = await api.get('sync')

	if (lastSync && lastSync > syncIds.lastModifiedAt)
		return

	await Promise.all(syncIds.clients.map(async ({id, modifiedAt}) =>
	{
		const existing = await db.table('clients').get(id)

		if (!existing)
		{
			const {data} = await api.get(`clients-raw/${id}`)
			await db.table('clients').add(data)
		}
		else if (lastSync && lastSync <= modifiedAt)
		{
			const {data} = await api.get(`clients-raw/${id}`)
			await db.table('clients').put(data)
		}
	}))

	await Promise.all(syncIds.companies.map(async ({id, modifiedAt}) =>
	{
		const existing = await db.table('companies').get(id)

		if (!existing)
		{
			const {data} = await api.get(`companies/${id}/raw`)
			await db.table('companies').add(data)
		}
		else if (lastSync && lastSync <= modifiedAt)
		{
			const {data} = await api.get(`companies/${id}/raw`)
			await db.table('companies').put(data)
		}
	}))

	await Promise.all(syncIds.requests.map(async ({id, modifiedAt}) =>
	{
		const existing = await db.table('requests').get(id)

		if (!existing)
		{
			const {data} = await api.get(`requests-raw/${id}`)
			await db.table('requests').add(data)
		}
		else if (lastSync && lastSync <= modifiedAt)
		{
			const {data} = await api.get(`requests-raw/${id}`)
			await db.table('requests').put(data)
		}
	}))

	await Promise.all(syncIds.sellers.map(async ({id, modifiedAt}) =>
	{
		const existing = await db.table('sellers').get(id)

		if (!existing)
		{
			const {data} = await api.get(`sellers-raw/${id}`)
			await db.table('sellers').add(data)
		}
		else if (lastSync && lastSync <= modifiedAt)
		{
			const {data} = await api.get(`sellers-raw/${id}`)
			await db.table('sellers').put(data)
		}
	}))
}