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
	}
}