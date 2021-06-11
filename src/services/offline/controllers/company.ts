import CompanyRaw from '../../../models/company'
import { handleObjectId } from '../../../utils/handleObjectId'
import db from '../db'

export const companyController =
{
	create: async (body: any) =>
	{
		const {
			_id,
			razao_social, 
			nome_fantasia,
			cnpj,
			telefones,
			email,
			comissao,
			descricao_curta,
			descricao,
			site,
			tabelas,
			condicoes
		} = body

		const id = handleObjectId(_id)
		const addedCompany =
		{
			_id: id,
			razao_social, 
			nome_fantasia,
			cnpj,
			telefones,
			email,
			comissao,
			descricao_curta,
			descricao,
			site,
			tabelas,
			condicoes,
		}

		await db.table('companies').add(addedCompany, id)
	},

	update: async (body: any, id?: string) =>
	{
		if (!id)
			return
		
		const {
			razao_social, 
			nome_fantasia,
			cnpj,
			telefones,
			email,
			comissao,
			descricao_curta,
			descricao,
			site,
			tabelas,
			condicoes
		} = body

		const updatedCompany =
		{
			_id: id,
			razao_social, 
			nome_fantasia,
			cnpj,
			telefones,
			email,
			comissao,
			descricao_curta,
			descricao,
			site,
			tabelas,
			condicoes
		}

		await db.table('companies').put(updatedCompany, id)
	},

	remove: async (id?: string) =>
	{
		if (!id)
			return
		
		await db.table('companies').delete(id)
	},
	
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
	}
}