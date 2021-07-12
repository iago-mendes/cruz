import db from '../db'
import ClientRaw, {ClientListed} from '../../../models/client'
import {isSubstring} from '../../../utils/isSubstring'
import {handleObjectId} from '../../../utils/handleObjectId'

export const clientController = {
	create: async (body: any) => {
		const {
			_id,
			razao_social,
			nome_fantasia,
			cnpj,
			insc_estadual,
			telefone,
			email,
			vendedores,
			endereco,
			status,
			condicoes,
			contatos,
			representadas,
			obs
		} = body

		const id = handleObjectId(_id)
		const addedClient = {
			_id: id,
			razao_social,
			nome_fantasia,
			cnpj,
			insc_estadual,
			telefone,
			email,
			vendedores,
			endereco,
			status,
			condicoes,
			contatos,
			representadas,
			obs
		}

		await db.table('clients').add(addedClient, id)
	},

	update: async (body: any, id?: string) => {
		if (!id) return

		const previousClient: ClientRaw = await db.table('clients').get(id)
		if (!previousClient) return

		const {
			razao_social,
			nome_fantasia,
			cnpj,
			insc_estadual,
			telefone,
			email,
			vendedores,
			endereco,
			status,
			condicoes,
			contatos,
			representadas,
			obs
		} = body

		const updatedClient = {
			_id: id,
			imagem: previousClient.imagem,
			razao_social: razao_social ? razao_social : previousClient.razao_social,
			nome_fantasia: nome_fantasia
				? nome_fantasia
				: previousClient.nome_fantasia,
			cnpj: cnpj ? cnpj : previousClient.cnpj,
			insc_estadual: insc_estadual
				? insc_estadual
				: previousClient.insc_estadual,
			telefone: telefone ? telefone : previousClient.telefone,
			email: email ? email : previousClient.email,
			vendedores: vendedores
				? JSON.parse(vendedores)
				: previousClient.vendedores,
			endereco: endereco ? JSON.parse(endereco) : previousClient.endereco,
			status: status ? JSON.parse(status) : previousClient.status,
			condicoes: condicoes ? JSON.parse(condicoes) : previousClient.condicoes,
			contatos: contatos ? JSON.parse(contatos) : previousClient.contatos,
			representadas: representadas
				? JSON.parse(representadas)
				: previousClient.representadas,
			obs: obs ? obs : previousClient.obs
		}
		console.log('<< updatedClient >>', updatedClient)

		await db.table('clients').put(updatedClient, id)
	},

	remove: async (id?: string) => {
		if (!id) return

		await db.table('clients').delete(id)
	},

	addContact: async (body: any, id?: string) => {
		if (!id) return
		const {nome, telefone}: {nome: string; telefone: string} = body

		const previousClient = await db.table('clients').get(id)
		if (!previousClient) return

		const contacts: Array<{
			nome: string
			telefone: string
		}> = previousClient.contatos ? previousClient.contatos : []

		contacts.push({nome, telefone})

		const updatedClient = {
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
	},

	list: async (search?: string, requestedPage?: number) => {
		const rawClients: ClientRaw[] = await db
			.table('clients')
			.orderBy('nome_fantasia')
			.toArray()

		const searchedClients =
			!search || search === ''
				? rawClients
				: rawClients.filter((client: ClientRaw) => {
						const searchResult1 = isSubstring(client.nome_fantasia, search)
						const searchResult2 = isSubstring(client.razao_social, search)
						const searchResult3 = isSubstring(client.endereco.cidade, search)
						const searchResult4 = client.email === search

						return (
							searchResult1 || searchResult2 || searchResult3 || searchResult4
						)
				  })

		const clientsPerPage = 15
		const totalPages =
			searchedClients.length > 0
				? Math.ceil(searchedClients.length / clientsPerPage)
				: 1

		const page = requestedPage ? Number(requestedPage) : 1
		if (!(page > 0 && page <= totalPages) || Number.isNaN(page))
			return undefined

		const sliceStart = (page - 1) * clientsPerPage
		const clients: ClientListed[] = searchedClients
			.slice(sliceStart, sliceStart + clientsPerPage)
			.map(client => ({
				id: client._id,
				imagem: client.imagem,
				nome_fantasia: client.nome_fantasia,
				razao_social: client.razao_social,
				status: client.status
			}))

		const paginated = {
			clients,
			page,
			totalPages
		}

		return paginated
	},

	raw: async (search?: string, requestedPage?: number) => {
		const rawClients: ClientRaw[] = await db
			.table('clients')
			.where(['razao_social', 'nome_fantasia', 'endereco'])
			.equals(search)
			.sortBy('nome_fantasia')

		const clientsPerPage = 15
		const totalPages =
			rawClients.length > 0 ? Math.ceil(rawClients.length / clientsPerPage) : 1

		const page = requestedPage ? Number(requestedPage) : 1
		if (!(page > 0 && page <= totalPages) || Number.isNaN(page))
			return undefined

		const sliceStart = (page - 1) * clientsPerPage
		const clients = rawClients.slice(sliceStart, sliceStart + clientsPerPage)

		const paginated = {
			clients,
			page,
			totalPages
		}

		return paginated
	},

	rawOne: async (id?: string) => {
		if (!id) return undefined

		const rawClient: ClientRaw = await db.table('clients').get(id)
		return rawClient
	}
}
