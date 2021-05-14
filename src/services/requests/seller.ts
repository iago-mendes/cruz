import { SellerRaw } from '../../models/seller'
import api from '../api'
import db from '../db'

export async function getRawSellers()
{
	const cached = await db.table('sellers').toArray()
	if (cached && cached.length > 0)
		return cached
	
	const {data}:{data: SellerRaw[]} = await api.get('sellers-raw')

	return data
}

export async function getRawSeller(id: string)
{
	const cached = await db.table('sellers').get(id)
	if (cached)
		return cached

	const {data}:{data: SellerRaw} = await api.get(`sellers-raw/${id}`)

	return data
}