import { getRandomString } from '../../../utils/getRandomString'
import db from '../../db'

export const client =
{
	create: async (body: any) =>
	{
		const {
			razao_social,
			nome_fantasia,
			cnpj,
			insc_estadual,
			telefone,
			email,
			senha,
			vendedores,
			endereco,
			status,
			condicoes,
			contatos,
			representadas
		} = body

		const id = getRandomString('tmpId')
		const addedClient =
		{
			_id: id,
			razao_social,
			nome_fantasia,
			cnpj,
			insc_estadual,
			telefone,
			email,
			senha,
			vendedores,
			endereco,
			status,
			condicoes,
			contatos,
			representadas
		}

		await db.table('clients').add(addedClient, id)
	},

	update: async (body: any, id?: string) =>
	{
		if (!id)
			return
		
		const {
			razao_social,
			nome_fantasia,
			cnpj,
			insc_estadual,
			telefone,
			email,
			senha,
			vendedores,
			endereco,
			status,
			condicoes,
			contatos,
			representadas
		} = body

		const updatedClient =
		{
			_id: id,
			razao_social,
			nome_fantasia,
			cnpj,
			insc_estadual,
			telefone,
			email,
			senha,
			vendedores,
			endereco,
			status,
			condicoes,
			contatos,
			representadas
		}

		await db.table('clients').put(updatedClient, id)
	},

	remove: async (id?: string) =>
	{
		if (!id)
			return
		
		await db.table('clients').delete(id)
	},

	addContact: async (body: any, id?: string) =>
	{
		if (!id)
			return
		const {nome, telefone}:{nome: string, telefone: string} = body

		const previousClient = await db.table('clients').get(id)
		if (!previousClient)
			return
		
		let contacts: Array<
		{
			nome: string
			telefone: string
		}> = previousClient.contatos ? previousClient.contatos : []

		contacts.push({nome, telefone})

		const updatedClient =
		{
			_id: id,
			razao_social: previousClient.razao_social,
			nome_fantasia: previousClient.nome_fantasia,
			cnpj: previousClient.cnpj,
			insc_estadual: previousClient.insc_estadual,
			telefone: previousClient.telefone,
			email: previousClient.email,
			senha: previousClient.senha,
			vendedores: previousClient.vendedores,
			endereco: previousClient.endereco,
			status: previousClient.status,
			condicoes: previousClient.condicoes,
			contatos: contacts,
			representadas: previousClient.representadas
		}
		
		await db.table('clients').put(updatedClient, id)
	}
}