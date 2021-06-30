import ClientRaw from '../../../models/client'
import CompanyRaw from '../../../models/company'
import formatImage from '../../../utils/formatImage'
import {handleObjectId} from '../../../utils/handleObjectId'
import db from '../db'

export const productController = {
	create: async (body: any, companyId?: string) => {
		const {
			_id,
			nome,
			unidade,
			ipi,
			st,
			tabelas,
			codigo,
			comissao,
			peso,
			volume
		} = body

		if (!companyId) return undefined

		const company: CompanyRaw = await db.table('companies').get(companyId)
		if (!company) return undefined

		company.produtos.push({
			_id: handleObjectId(_id),
			imagem: undefined,
			nome,
			unidade,
			ipi,
			st,
			tabelas: JSON.parse(tabelas),
			codigo,
			comissao,
			peso,
			volume
		})

		await db.table('companies').put(company, companyId)
	},

	update: async (body: any, companyId?: string, productId?: string) => {
		const {
			nome,
			unidade,
			ipi,
			st,
			tabelas,
			codigo,
			comissao,
			peso,
			volume,
			isBlocked
		} = body

		if (!companyId || !productId) return undefined

		const company: CompanyRaw = await db.table('companies').get(companyId)
		if (!company) return undefined

		const existingIndex = company.produtos.findIndex(
			product => String(product._id) == String(productId)
		)
		if (existingIndex < 0) return undefined
		const previous = company.produtos[existingIndex]

		company.produtos[existingIndex] = {
			_id: previous._id,
			imagem: previous.imagem,
			codigo: codigo ? codigo : previous.codigo,
			nome: nome ? nome : previous.nome,
			ipi: ipi ? ipi : previous.ipi,
			st: st ? st : previous.st,
			peso: peso ? peso : previous.peso,
			volume: volume ? volume : previous.volume,
			unidade: unidade ? unidade : previous.unidade,
			comissao: comissao ? comissao : previous.comissao,
			tabelas: tabelas ? JSON.parse(tabelas) : previous.tabelas,
			isBlocked: isBlocked != undefined ? isBlocked : previous.isBlocked
		}

		await db.table('companies').put(company, companyId)
	},

	remove: async (companyId?: string, productId?: string) => {
		if (!companyId || !productId) return undefined

		const company: CompanyRaw = await db.table('companies').get(companyId)
		if (!company) return undefined

		const existingIndex = company.produtos.findIndex(
			product => String(product._id) == String(productId)
		)
		if (existingIndex < 0) return undefined

		company.produtos.splice(existingIndex, 1)

		await db.table('companies').put(company, companyId)
	},

	listPriced: async (companyId?: string, clientId?: string) => {
		if (!companyId || !clientId) return undefined

		const rawCompany: CompanyRaw = await db.table('companies').get(companyId)
		const client: ClientRaw = await db.table('clients').get(clientId)

		if (!rawCompany || !client) return undefined

		const tableId = client.representadas.find(
			company => company.id === rawCompany._id
		)?.tabela
		if (!tableId) return undefined

		const products = rawCompany.produtos
			.filter(product => product.isBlocked !== true)
			.map(product => ({
				id: product._id,
				imagem: formatImage(product.imagem),
				nome: product.nome,
				unidade: product.unidade,
				st: product.st,
				ipi: product.ipi,
				preco: product.tabelas.find(
					tabela => String(tabela.id) == String(tableId)
				)?.preco
			}))
		products.sort((a, b) => (a.nome < b.nome ? -1 : 1))

		return products
	},

	listDefaultPriced: async (companyId?: string) => {
		if (!companyId) return undefined

		const rawCompany: CompanyRaw = await db.table('companies').get(companyId)
		if (!rawCompany) return undefined

		const products = rawCompany.produtos
			.filter(product => product.isBlocked !== true)
			.map(product => ({
				id: product._id,
				imagem: formatImage(product.imagem),
				nome: product.nome,
				unidade: product.unidade,
				st: product.st,
				ipi: product.ipi,
				preco: product.tabelas[0].preco
			}))
		products.sort((a, b) => (a.nome < b.nome ? -1 : 1))

		return products
	},

	raw: async (companyId?: string) => {
		if (!companyId) return undefined

		const rawCompany: CompanyRaw = await db.table('companies').get(companyId)
		const products = rawCompany.produtos.map(product => {
			const tmpProduct = product
			tmpProduct.imagem = formatImage(product.imagem)

			return tmpProduct
		})

		return products
	},

	rawOne: async (companyId?: string, productId?: string) => {
		if (!companyId || !productId) return undefined

		const rawCompany: CompanyRaw = await db.table('companies').get(companyId)
		const product = rawCompany.produtos.find(({_id}) => _id === productId)

		if (product) product.imagem = formatImage(product.imagem)

		return product
	}
}
