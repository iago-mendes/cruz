import ClientRaw from '../../../../models/client'
import CompanyRaw from '../../../../models/company'
import formatImage from '../../../../utils/formatImage'
import db from '../../db'

export const productController =
{
	listPriced: async (companyId?: string, clientId?: string) =>
	{
		if (!companyId || !clientId)
			return undefined
		
		const rawCompany: CompanyRaw = await db.table('companies').get(companyId)
		const client: ClientRaw = await db.table('clients').get(clientId)

		if (!rawCompany || !client)
			return undefined
		
		const tableId = client.representadas.find(company => company.id === rawCompany._id)?.tabela
		if (!tableId)
			return undefined
		
		let products = rawCompany.produtos.map(product => (
			{
				id: product._id,
				imagem: formatImage(product.imagem),
				nome: product.nome,
				unidade: product.unidade,
				st: product.st,
				ipi: product.ipi,
				preco: product.tabelas.find(tabela => String(tabela.id) == String(tableId))?.preco,
			}))
		products.sort((a, b) => a.nome < b.nome ? -1 : 1)

		return products
	},

	listDefaultPriced: async (companyId?: string) =>
	{
		if (!companyId)
			return undefined
		
		const rawCompany: CompanyRaw = await db.table('companies').get(companyId)
		if (!rawCompany)
			return undefined
		
		let products = rawCompany.produtos.map(product => (
			{
				id: product._id,
				imagem: formatImage(product.imagem),
				nome: product.nome,
				unidade: product.unidade,
				st: product.st,
				ipi: product.ipi,
				preco: product.tabelas[0].preco,
			}))
		products.sort((a, b) => a.nome < b.nome ? -1 : 1)

		return products
	},

	raw: async (companyId?: string) =>
	{
		if (!companyId)
			return undefined
		
		const rawCompany: CompanyRaw = await db.table('companies').get(companyId)
		const products = rawCompany.produtos.map(product =>
		{
			let tmpProduct = product
			tmpProduct.imagem = formatImage(product.imagem)

			return tmpProduct
		})

		return products
	},

	rawOne: async (companyId?: string, productId?: string) =>
	{
		if (!companyId || !productId)
			return undefined
		
		const rawCompany: CompanyRaw = await db.table('companies').get(companyId)
		let product = rawCompany.produtos.find(({_id}) => _id === productId)

		if (product)
			product.imagem = formatImage(product.imagem)

		return product
	}
}