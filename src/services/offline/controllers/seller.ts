import { SellerRaw } from '../../../models/seller'
import { handleObjectId } from '../../../utils/handleObjectId'
import db from '../db'

export const sellerController =
{
	create: async (body: any) =>
	{
		const {
			_id,
			nome,
			telefones,
			email,
			funcao,
			admin,
			representadas
		} = body

		const id = handleObjectId(_id)
		const addedSeller =
		{
			_id: id,
			nome,
			telefones,
			email,
			funcao,
			admin,
			representadas
		}

		await db.table('sellers').add(addedSeller, id)
	},

	update: async (body: any, id?: string) =>
	{
		if (!id)
			return
		
		const previousSeller = await db.table('sellers').get(id)
		if (!previousSeller)
			return
		
		const {
			nome,
			telefones,
			email,
			funcao,
			admin,
			representadas
		} = body

		const updatedSeller =
		{
			_id: id,
			imagem: previousSeller.imagem,
			nome: nome ? nome : previousSeller.nome,
			telefones: telefones ? telefones : previousSeller.telefones,
			email: email ? email : previousSeller.email,
			funcao: funcao ? funcao : previousSeller.funcao,
			admin: admin ? admin : previousSeller.admin,
			representadas: representadas ? representadas : previousSeller.representadas
		}

		await db.table('sellers').put(updatedSeller, id)
	},

	remove: async (id?: string) =>
	{
		if (!id)
			return
		
		await db.table('sellers').delete(id)
	},

	list: async () =>
	{
		const sellers: SellerRaw[] = await db.table('sellers').toArray()

		const list = sellers.map(seller => (
			{
				id: seller._id,
				imagem: seller.imagem,
				nome: seller.nome,
				funcao: seller.funcao
			}))

		return list
	},

	raw: async () =>
	{
		const sellers: SellerRaw[] = await db.table('sellers').toArray()
		return sellers
	},

	rawOne: async (id?: string) =>
	{
		if (!id)
			return undefined
		
		const rawSeller: SellerRaw = await db.table('sellers').get(id)
		return rawSeller
	}
}