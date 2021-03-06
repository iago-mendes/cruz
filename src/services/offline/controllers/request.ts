import db from '../db'
import RequestRaw from '../../../models/request'
import ClientRaw from '../../../models/client'
import {SellerRaw} from '../../../models/seller'
import CompanyRaw from '../../../models/company'
import {getPricedProducts} from '../../../utils/requests/getPricedProducts'
import formatImage from '../../../utils/formatImage'
import {handleObjectId} from '../../../utils/handleObjectId'

export const requestController = {
	create: async (body: any) => {
		const {
			_id,
			data,
			condicao,
			digitado_por,
			cliente,
			vendedor,
			representada,
			contato,
			frete,
			tipo,
			status,
			produtos,
			obs
		} = body

		const id = handleObjectId(_id)
		const addedRequest = {
			_id: id,
			data,
			condicao,
			digitado_por,
			cliente,
			vendedor,
			representada,
			contato,
			frete,
			tipo,
			status,
			produtos,
			obs
		}

		await db.table('requests').add(addedRequest, id)
	},

	update: async (body: any, id?: string) => {
		if (!id) return

		const previousRequest = await db.table('requests').get(id)
		if (!previousRequest) return

		const {
			data,
			condicao,
			digitado_por,
			cliente,
			vendedor,
			representada,
			contato,
			frete,
			tipo,
			status,
			produtos,
			obs
		} = body

		const updatedRequest = {
			_id: id,
			data: data ? data : previousRequest.data,
			condicao: condicao ? condicao : previousRequest.condicao,
			digitado_por: digitado_por ? digitado_por : previousRequest.digitado_por,
			cliente: cliente ? cliente : previousRequest.cliente,
			vendedor: vendedor ? vendedor : previousRequest.vendedor,
			representada: representada ? representada : previousRequest.representada,
			contato: contato ? contato : previousRequest.contato,
			frete: frete ? frete : previousRequest.frete,
			tipo: tipo ? tipo : previousRequest.tipo,
			status: status ? status : previousRequest.status,
			produtos: produtos ? produtos : previousRequest.produtos,
			obs: obs ? obs : previousRequest.obs
		}

		await db.table('requests').put(updatedRequest, id)
	},

	remove: async (id?: string) => {
		if (!id) return

		await db.table('requests').delete(id)
	},

	list: async (requestedPage?: number) => {
		const rawRequests: RequestRaw[] = await db.table('requests').toArray()
		rawRequests.sort((a, b) => (a.data > b.data ? -1 : 1))

		const requestsPerPage = 15
		const totalPages =
			rawRequests.length > 0
				? Math.ceil(rawRequests.length / requestsPerPage)
				: 1

		const page = requestedPage ? Number(requestedPage) : 1
		if (!(page > 0 && page <= totalPages) || Number.isNaN(page))
			return undefined

		const sliceStart = (page - 1) * requestsPerPage
		const requests = await Promise.all(
			rawRequests
				.slice(sliceStart, sliceStart + requestsPerPage)
				.map(async request => {
					const client: ClientRaw = await db
						.table('clients')
						.get(request.cliente)
					const company: CompanyRaw = await db
						.table('companies')
						.get(request.representada)
					const seller: SellerRaw = request.vendedor
						? await db.table('sellers').get(request.vendedor)
						: undefined

					const {totalValue} = await getPricedProducts(request, company, client)

					return {
						id: request._id,
						data: request.data,
						cliente: {
							imagem: client.imagem,
							nome_fantasia: client.nome_fantasia,
							razao_social: client.razao_social
						},
						vendedor: {
							imagem: seller ? seller.imagem : formatImage(undefined),
							nome: seller ? seller.nome : 'E-Commerce'
						},
						representada: {
							imagem: company.imagem,
							nome_fantasia: company.nome_fantasia,
							razao_social: company.razao_social
						},
						tipo: request.tipo,
						status: request.status,
						valorTotal: totalValue
					}
				})
		)

		const paginated = {
			requests,
			page,
			totalPages
		}

		return paginated
	},

	raw: async () => {
		const requests = await db.table('requests').toArray()
		return requests
	},

	rawOne: async (id?: string) => {
		if (!id) return undefined

		const rawRequest: RequestRaw = await db.table('requests').get(id)
		return rawRequest
	}
}
