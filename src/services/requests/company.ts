import CompanyRaw from '../../models/company'
import api from '../api'
import db from '../db'

export async function getRawCompanies()
{
	const cached = await db.table('companies').toArray()
	if (cached && cached.length > 0)
		return cached

	const {data}:{data: CompanyRaw[]} = await api.get('companies/raw')

	return data
}

export async function getRawCompany(id: string)
{
	const cached = await db.table('companies').get(id)
	if (cached)
		return cached

	const {data}:{data: CompanyRaw} = await api.get(`companies/${id}/raw`)

	return data
}