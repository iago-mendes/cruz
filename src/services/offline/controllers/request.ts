import { getRandomString } from '../../../utils/getRandomString'
import db from '../../db'

export const request =
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
	}
}