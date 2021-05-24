import ClientRaw from '../../../models/client'
import CompanyRaw from '../../../models/company'
import db from '../db'

export const companyController =
{
	list: async () =>
	{
		const companies: CompanyRaw[] = await db.table('companies').toArray()

		const list = companies.map(company => (
			{
				id: company._id,
				imagem: company.imagem,
				nome_fantasia: company.nome_fantasia,
				descricao_curta: String(company.descricao_curta)
			}))
		list.sort((a,b) => a.nome_fantasia < b.nome_fantasia ? -1 : 1)

		return list
	},

	raw: async () =>
	{
		const companies: CompanyRaw[] = await db.table('companies').toArray()
		return companies
	},

	rawOne: async (id?: string) =>
	{
		if (!id)
			return undefined
		
		const rawCompany: CompanyRaw = await db.table('companies').get(id)
		return rawCompany
	},

	rawProducts: async (id?: string) =>
	{
		if (!id)
			return undefined
		
		const rawCompany: CompanyRaw = await db.table('companies').get(id)
		const products = rawCompany.produtos

		return products
	},

	listPricedProducts: async (companyId?: string, clientId?: string) =>
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
				imagem: product.imagem,
				nome: product.nome,
				unidade: product.unidade,
				st: product.st,
				ipi: product.ipi,
				preco: product.tabelas.find(tabela => String(tabela.id) == String(tableId))?.preco,
			}))
		products.sort((a, b) => a.nome < b.nome ? -1 : 1)

		return products
	}
}