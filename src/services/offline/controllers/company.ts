import CompanyRaw from '../../../models/company'
import {handleObjectId} from '../../../utils/handleObjectId'
import db from '../db'

export const companyController = {
	create: async (body: any) => {
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
		const addedCompany = {
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

		await db.table('companies').add(addedCompany, id)
	},

	update: async (body: any, id?: string) => {
		if (!id) return

		const previousCompany = await db.table('companies').get(id)
		if (!previousCompany) return

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

		const updatedCompany = {
			_id: id,
			imagem: previousCompany.imagem,
			razao_social: razao_social ? razao_social : previousCompany.razao_social,
			nome_fantasia: nome_fantasia
				? nome_fantasia
				: previousCompany.nome_fantasia,
			cnpj: cnpj ? cnpj : previousCompany.cnpj,
			telefones: telefones ? telefones : previousCompany.telefones,
			email: email ? email : previousCompany.email,
			comissao: comissao ? comissao : previousCompany.comissao,
			descricao_curta: descricao_curta
				? descricao_curta
				: previousCompany.descricao_curta,
			descricao: descricao ? descricao : previousCompany.descricao,
			site: site ? site : previousCompany.site,
			tabelas: tabelas ? tabelas : previousCompany.tabelas,
			condicoes: condicoes ? condicoes : previousCompany.condicoes
		}

		await db.table('companies').put(updatedCompany, id)
	},

	remove: async (id?: string) => {
		if (!id) return

		await db.table('companies').delete(id)
	},

	list: async () => {
		const companies: CompanyRaw[] = await db.table('companies').toArray()

		const list = companies.map(company => ({
			id: company._id,
			imagem: company.imagem,
			nome_fantasia: company.nome_fantasia,
			descricao_curta: String(company.descricao_curta)
		}))
		list.sort((a, b) => (a.nome_fantasia < b.nome_fantasia ? -1 : 1))

		return list
	},

	raw: async () => {
		const companies: CompanyRaw[] = await db.table('companies').toArray()
		return companies
	},

	rawOne: async (id?: string) => {
		if (!id) return undefined

		const rawCompany: CompanyRaw = await db.table('companies').get(id)
		return rawCompany
	},

	updateTables: async (body: any, id?: string) => {
		if (!id) return

		const {
			targetTable,
			relatedTables
		}: {
			targetTable: {
				id: string
				change: number // 1 => no change
			}
			relatedTables: Array<{
				id: string
				relation: number // 1 => equal
			}>
		} = body

		if (!id) return undefined

		const company: CompanyRaw = await db.table('companies').get(id)
		if (!company) return undefined

		company.produtos = company.produtos.map(product => {
			const target = product.tabelas.find(
				({id}) => String(id) == String(targetTable.id)
			)
			if (!target) return product

			const newTargetPrice = target.preco * targetTable.change

			const tmpProduct = product
			tmpProduct.tabelas = product.tabelas.map(table => {
				const tmpTable = table

				const relatedTable = relatedTables.find(
					({id}) => String(id) == String(table.id)
				)

				if (String(table.id) == String(targetTable.id))
					tmpTable.preco = newTargetPrice
				else if (relatedTable)
					tmpTable.preco = newTargetPrice * relatedTable.relation

				return tmpTable
			})

			return tmpProduct
		})

		company.relatedTables = relatedTables.map(table => ({
			id: table.id,
			target: targetTable.id,
			relation: table.relation
		}))

		await db.table('companies').put(company, id)
	}
}
