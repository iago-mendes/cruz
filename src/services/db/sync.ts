import { AxiosRequestConfig } from 'axios'
import pLimit from 'p-limit'

import db from '.'
import successAlert from '../../utils/alerts/success'
import getDate from '../../utils/getDate'
import api from '../api'

const limit = pLimit(10)

type SyncId =
{
	id: string
	modifiedAt: string
}

export async function sync(setLoading?: (loading: boolean) => void)
{
	if (setLoading)
		setLoading(true)

	await sendApiCalls()
	await getData()

	const today = getDate()
	localStorage.setItem('last-sync', today)

	if (setLoading)
	{
		setLoading(false)
		successAlert('Sincronização concluída com sucesso!')
	}
}

async function getData()
{
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

	const lastSync = localStorage.getItem('last-sync')
	if (lastSync && lastSync > syncIds.lastModifiedAt)
		return
	
	await handleAsyncCalls(syncIds.clients, 'clients')
	await handleAsyncCalls(syncIds.companies, 'companies')
	await handleAsyncCalls(syncIds.requests, 'requests')
	await handleAsyncCalls(syncIds.sellers, 'sellers')
}

async function handleAsyncCalls(ids: SyncId[], table: string)
{
	const lastSync = localStorage.getItem('last-sync')
	
	const promises = ids.map(({id, modifiedAt}) =>
	{
		const apiRoute = table === 'companies'
			? `${table}/${id}/raw`
			: `${table}-raw/${id}`

		async function promise()
		{
			const existing = await db.table(table).get(id)
	
			if (!existing)
			{
				const {data} = await api.get(apiRoute)
				await db.table(table).add(data)
			}
			else if (lastSync && lastSync <= modifiedAt)
			{
				const {data} = await api.get(apiRoute)
				await db.table(table).put(data)
			}
		}

		return limit(promise)
	})

	await Promise.all(promises)
}

async function sendApiCalls()
{
	const apiCalls: Array<
	{
		date: string
		config: string
	}> = await db.table('apiQueue').toArray()

	apiCalls.sort((a, b) => a.date < b.date ? -1 : 1)
	const promises = apiCalls.map(async apiCall =>
	{
		const config: AxiosRequestConfig = JSON.parse(apiCall.config)
		await api.request(config)
	})

	await Promise.all(promises)

	await db.table('apiQueue').clear()
}