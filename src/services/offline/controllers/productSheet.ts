import db from '../db'
import CompanyRaw from '../../../models/company'

import productHeader from '../../../../db/sheets/productHeader.json'

export const productSheetController =
{
	setProducts: async (body: any, companyId?: string) =>
	{
		const {header, data: sheetProducts}:
		{
			header: string[]
			data: Array<
			{
				[fieldName: string]: string | number
			}>
		} = body

		if (!companyId)
			return undefined
		
		let company: CompanyRaw = await db.table('companies').get(companyId)
		if (!company)
			return undefined
		
		const fullHeader = getFullHeader(company)
		if (header.length !== fullHeader.length)
			return undefined
			
		let isValid = true
		fullHeader.map(({name}, index) =>
		{
			if (header[index] !== name)
				isValid = false
		})
		if (!isValid)
			return undefined

		sheetProducts.map(sheetProduct =>
		{
			let tables: Array<{id: string, preco: number}> = []
			const code = String(sheetProduct[getFieldName('codigo')])
					
			fullHeader.map(({name: fieldName, field}) =>
			{
				if (fieldName.split(' ')[0] === 'Tabela')
					tables.push(
						{
							id: field,
							preco: Number(sheetProduct[fieldName])
						})
			})
		
			const previousIndex = company.produtos.findIndex(({codigo}) => String(codigo) === String(code))
			if (previousIndex < 0)
				return
			
			company.produtos[previousIndex] =
			{
				_id: company.produtos[previousIndex]._id,
				imagem: company.produtos[previousIndex].imagem,
				codigo: code,
				nome: String(sheetProduct[getFieldName('nome')]),
				comissao: Number(sheetProduct[getFieldName('comissao')]),
				unidade: String(sheetProduct[getFieldName('unidade')]),
				peso: Number(sheetProduct[getFieldName('peso')]),
				volume: Number(sheetProduct[getFieldName('volume')]),
				ipi: Number(sheetProduct[getFieldName('ipi')]),
				st: Number(sheetProduct[getFieldName('st')]),
				tabelas: tables
			}
		})

		await db.table('companies').put(company, companyId)
	}
}

function getFullHeader(company: CompanyRaw)
{
	const tables = company.tabelas
	let fullHeader = [...productHeader]

	tables.map(table =>
	{
		fullHeader.push(
			{
				name: `Tabela ${table.nome}`,
				field: String(table._id)
			})
	})

	return fullHeader
}

function getFieldName(field: string)
{
	const column = productHeader.find(column => column.field === field)
	if (!column)
		return ''
	
	return column.name
}