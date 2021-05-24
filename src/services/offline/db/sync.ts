import pLimit from 'p-limit'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

import db from '.'
import successAlert from '../../../utils/alerts/success'
import warningAlert from '../../../utils/alerts/warning'
import getDate from '../../../utils/getDate'
import api from '../../api'
import { Config } from '../ApiCall'

const limit = pLimit(10)
const MySwal = withReactContent(Swal)

type SyncId =
{
	id: string
	modifiedAt: string
}

export async function sync()
{
	if (!navigator.onLine)
		return warningAlert(
			'Você está offline!',
			'Sincronização de dados só é possível com acesso à internet.'
		)

	MySwal.fire(
		{
			title: 'Sincronizando dados...',
			allowOutsideClick: false,
			showConfirmButton: false,
			willOpen: () => {
				MySwal.showLoading()
			}
		})

	await sendApiCalls()
	await getData()

	const today = getDate()
	localStorage.setItem('last-sync', today)

	MySwal.close()
	successAlert('Sincronização concluída com sucesso!')
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

	await handleDeletedItems(syncIds.clients, 'clients')
	await handleDeletedItems(syncIds.companies, 'companies')
	await handleDeletedItems(syncIds.requests, 'requests')
	await handleDeletedItems(syncIds.sellers, 'sellers')

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
	
	await Promise.all(ids.map(({id, modifiedAt}) =>
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
	}))
}

async function handleDeletedItems(ids: SyncId[], table: string)
{
	const savedIds = await db.table(table).toCollection().primaryKeys()
	await Promise.all(savedIds.map(savedId =>
	{
		const id = String(savedId.valueOf())

		async function promise()
		{
			const wasDeleted = ids.findIndex(({id: apiId}) => apiId === id) < 0
			if (wasDeleted)
				await db.table(table).delete(id)
		}

		return limit(promise)
	}))
}

async function sendApiCalls()
{
	const apiCalls: Array<
	{
		id: string
		date: string
		config: Config
	}> = await db.table('apiQueue').toArray()

	apiCalls.sort((a, b) => a.date < b.date ? -1 : 1)
	const promises = apiCalls.map(({id, config}) =>
	{
		const data = config.data ? new FormData() : undefined
		
		if (data)
		{
			const dataArray = Object.entries(config.data)
			dataArray.forEach(([key, value]) =>
			{
				if (!(value instanceof File))
					data.append(key, String(value))
			})
		}

		async function promise()
		{
			if (!config.url.includes('tmpId'))
			{
				const requestConfig = {data, ...config}
				await api.request(requestConfig)
			}

			await db.table('apiQueue').delete(id)
		}

		return limit(promise)
	})

	await Promise.all(promises)
}