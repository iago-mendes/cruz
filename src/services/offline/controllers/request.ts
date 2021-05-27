import { getRandomString } from '../../../utils/getRandomString'
import db from '../db'
import RequestRaw from '../../../models/request'
import ClientRaw from '../../../models/client'
import { SellerRaw } from '../../../models/seller'
import CompanyRaw from '../../../models/company'
import getPricedProducts from '../../../utils/getPricedProducts'
import formatImage from '../../../utils/formatImage'

export const requestController =
{
	create: async (body: any) =>
	{
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
		} = body

		const id = getRandomString('tmpId')
		const addedRequest =
		{
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
			produtos
		}

		await db.table('requests').add(addedRequest, id)
	},

	update: async (body: any, id?: string) =>
	{
		if (!id)
			return
		
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
			produtos
		} = body

		const updatedRequest =
		{
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
			produtos
		}

		await db.table('requests').put(updatedRequest, id)
	},

	remove: async (id?: string) =>
	{
		if (!id)
			return
		
		await db.table('requests').delete(id)
	},

	list: async () =>
	{
		let rawRequests: RequestRaw[] = await db.table('requests').toArray()
		rawRequests.sort((a, b) => a.data > b.data ? -1 : 1)

		const requests = await Promise.all(rawRequests.map(async request =>
		{
			const client: ClientRaw = await db.table('clients').get(request.cliente)
			const company: CompanyRaw = await db.table('companies').get(request.representada)
			const seller: SellerRaw = request.vendedor
				? await db.table('sellers').get(request.vendedor)
				: undefined

			const {totalValue} = getPricedProducts(request, company, client)

			return {
				id: request._id,
				data: request.data,
				cliente:
				{
					imagem: client.imagem,
					nome_fantasia: client.nome_fantasia,
					razao_social: client.razao_social
				},
				vendedor:
				{
					imagem: seller ? seller.imagem : formatImage(undefined),
					nome: seller ? seller.nome : 'E-Commerce'
				},
				representada:
				{
					imagem: company.imagem,
					nome_fantasia: company.nome_fantasia,
					razao_social: company.razao_social
				},
				tipo: request.tipo,
				status: request.status,
				valorTotal: totalValue
			}
		}))

		return requests
	},

	raw: async () =>
	{
		const requests = await db.table('requests').toArray()
		return requests
	},

	rawOne: async (id?: string) =>
	{
		if (!id)
			return undefined

		const rawRequest: RequestRaw = await db.table('requests').get(id)
		return rawRequest
	}
}