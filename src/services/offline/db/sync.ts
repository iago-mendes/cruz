import pLimit from 'p-limit'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

import db from '.'
import successAlert from '../../../utils/alerts/success'
import warningAlert from '../../../utils/alerts/warning'
import getDate from '../../../utils/getDate'
import api from '../../api'
import {Config} from '../ApiCall'

const limit = pLimit(10)
const MySwal = withReactContent(Swal)

type SyncId = {
	id?: string
	month?: string
	modifiedAt: string
}

export async function sync(
	inSyncPage = false,
	setLoadingMessage?: (loadingMessage: string) => void,
	setProgressBar?: (progressBar: number) => void
) {
	if (!navigator.onLine)
		return warningAlert(
			'Você está offline!',
			'Sincronização de dados só é possível com acesso à internet.'
		)

	if (inSyncPage) {
		setLoadingMessage('Enviando ações offline...')
		setProgressBar(5)
	} else
		MySwal.fire({
			title: 'Sincronizando dados...',
			allowOutsideClick: false,
			showConfirmButton: false,
			willOpen: () => {
				MySwal.showLoading()
			}
		})

	await sendApiCalls()
	await getData(inSyncPage, setLoadingMessage, setProgressBar)

	if (inSyncPage) {
		setLoadingMessage('Sincronização concluída com sucesso!')
		setProgressBar(100)
	}

	const today = getDate()
	localStorage.setItem('last-sync', today)

	if (!inSyncPage) {
		MySwal.close()
		successAlert('Sincronização concluída com sucesso!')
	}
}

async function getData(
	inSyncPage = false,
	setLoadingMessage?: (loadingMessage: string) => void,
	setProgressBar?: (progressBar: number) => void
) {
	const {
		data: syncIds
	}: {
		data: {
			lastModifiedAt: string
			clients: SyncId[]
			companies: SyncId[]
			requests: SyncId[]
			sellers: SyncId[]
			goals: SyncId[]
		}
	} = await api.get('sync')

	if (inSyncPage) {
		setLoadingMessage('Deletando itens...')
		setProgressBar(25)
	}
	await handleDeletedItems(syncIds.clients, 'clients')
	await handleDeletedItems(syncIds.companies, 'companies')
	await handleDeletedItems(syncIds.requests, 'requests')
	await handleDeletedItems(syncIds.sellers, 'sellers')
	await handleDeletedItems(syncIds.goals, 'goals')

	if (inSyncPage) {
		setLoadingMessage('Coletando dados...')
		setProgressBar(50)
	}
	const lastSync = localStorage.getItem('last-sync')
	if (lastSync && lastSync > syncIds.lastModifiedAt) return

	if (inSyncPage) {
		setLoadingMessage('Coletando clientes...')
		setProgressBar(60)
	}
	await handleAsyncCalls(syncIds.clients, 'clients')
	if (inSyncPage) {
		setLoadingMessage('Coletando representadas...')
		setProgressBar(70)
	}
	await handleAsyncCalls(syncIds.companies, 'companies')
	if (inSyncPage) {
		setLoadingMessage('Coletando pedidos...')
		setProgressBar(80)
	}
	await handleAsyncCalls(syncIds.requests, 'requests')
	if (inSyncPage) {
		setLoadingMessage('Coletando vendedores...')
		setProgressBar(90)
	}
	await handleAsyncCalls(syncIds.sellers, 'sellers')
	if (inSyncPage) {
		setLoadingMessage('Coletando metas...')
		setProgressBar(95)
	}
	await handleAsyncCalls(syncIds.goals, 'goals')
}

async function handleAsyncCalls(ids: SyncId[], table: string) {
	const lastSync = localStorage.getItem('last-sync')

	await Promise.all(
		ids.map(({id, month, modifiedAt}) => {
			let key = ''
			if (id) key = id
			else if (month) key = month
			else return

			const apiRoute = ['companies', 'goals'].includes(table)
				? `${table}/${key}/raw`
				: `${table}-raw/${key}`

			async function promise() {
				const existing = await db.table(table).get(key)

				if (!existing) {
					const {data} = await api.get(apiRoute)
					await db
						.table(table)
						.add(data)
						.catch(error => console.log('<< error >>', error))
				} else if (lastSync && lastSync <= modifiedAt) {
					const {data} = await api.get(apiRoute)
					await db
						.table(table)
						.put(data)
						.catch(error => console.log('<< error >>', error))
				}
			}

			return limit(promise)
		})
	)
}

async function handleDeletedItems(ids: SyncId[], table: string) {
	const savedKeys = await db.table(table).toCollection().primaryKeys()
	await Promise.all(
		savedKeys.map(savedKey => {
			const key = String(savedKey.valueOf())

			async function promise() {
				const wasDeleted =
					ids.findIndex(({id, month}) => {
						if (id) return id === key
						if (month) return month === key
					}) < 0
				if (wasDeleted) await db.table(table).delete(key)
			}

			return limit(promise)
		})
	)
}

async function sendApiCalls() {
	const apiCalls: Array<{
		id: string
		date: string
		config: Config
	}> = await db.table('apiQueue').toArray()

	apiCalls.sort((a, b) => (a.date < b.date ? -1 : 1))
	await Promise.all(
		apiCalls.map(({id, config}) => {
			const data = config.data ? new FormData() : undefined

			if (data) {
				const dataArray = Object.entries(config.data)
				dataArray.forEach(([key, value]) => {
					if (!(value instanceof File)) data.append(key, String(value))
				})
			}

			async function promise() {
				if (!config.url.includes('tmpId')) {
					const requestConfig = {data, ...config}
					await api.request(requestConfig)
				}

				await db.table('apiQueue').delete(id)
			}

			return limit(promise)
		})
	)
}
