import { SellerRaw } from '../../../models/seller'
import db from '../db'

export const sellerController =
{
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