import { SellerRaw } from '../../models/seller'
import api from '../api'

export async function getRawSellers()
{
	const {data}:{data: SellerRaw[]} = await api.get('sellers-raw')

	return data
}

export async function getRawSeller(id: string)
{
	const {data}:{data: SellerRaw} = await api.get(`sellers-raw/${id}`)

	return data
}