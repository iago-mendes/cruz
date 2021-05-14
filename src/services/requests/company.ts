import CompanyRaw from '../../models/company'
import api from '../api'

export async function getRawCompanies()
{
	const {data}:{data: CompanyRaw[]} = await api.get('companies/raw')

	return data
}

export async function getRawCompany(id: string)
{
	const {data}:{data: CompanyRaw} = await api.get(`companies/${id}/raw`)

	return data
}