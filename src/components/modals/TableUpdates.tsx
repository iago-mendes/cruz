import { useEffect, useState } from 'react'
import Select from 'react-select'

import { SelectOption } from '../../models'
import api from '../../services/api'
import Container from '../../styles/components/modals/TableUpdates'
import { selectStyles } from '../../styles/global'
import NumberInput from '../NumberInput'
import ModalContainer from './Container'

interface CompanyTable
{
	id: string
	nome: string
}

interface TableUpdatesModalProps
{
	isOpen: boolean
	setIsOpen: (p: boolean) => void

	companyId: string
}

const TableUpdatesModal: React.FC<TableUpdatesModalProps> = ({isOpen, setIsOpen, companyId}) =>
{
	const [companyTables, setCompanyTables] = useState<CompanyTable[]>([])
	const [targetTable, setTargetTable] = useState({id: '', change: 1})
	
	const targetTableOptions: SelectOption[] = companyTables
		.map(table => (
		{
			label: table.nome,
			value: table.id
		}))
	
	const relatedTableOptions: SelectOption[] = companyTables
		.filter(table => table.id !== targetTable.id)
		.map(table => (
		{
			label: table.nome,
			value: table.id
		}))
	
	const changeOptions: SelectOption[] =
	[
		{label: 'Acréscimo', value: 'increase'},
		{label: 'Desconto', value: 'decrease'}
	]

	useEffect(() =>
	{
		api.get(`companies/${companyId}/tables`)
			.then(({data}:{data: CompanyTable[]}) =>
			{
				setCompanyTables(data)

				const tmpTargetTable = {id: data[0].id, change: 1}
				setTargetTable(tmpTargetTable)
			})
	}, [])

	return (
		<ModalContainer
			isOpen={isOpen}
			setIsOpen={setIsOpen}
		>
			<Container>
				<div className='target'>
					<label>Atualização de tabela</label>
					<Select
						value={targetTableOptions.find(option => option.value === targetTable.id)}
						options={targetTableOptions}
						onChange={option => setTargetTable({id: option.value, change: 1})}
						styles={selectStyles}
					/>
					<div className='change'>
						<Select
							options={changeOptions}
							styles={selectStyles}
						/>
						<NumberInput
							value={targetTable.change}
							setValue={n => setTargetTable({id: targetTable.id, change: n})}
						/>
					</div>
				</div>

				<ul className='related'>
					<Select
						options={relatedTableOptions}
						styles={selectStyles}
					/>
				</ul>
			</Container>
		</ModalContainer>
	)
}

export default TableUpdatesModal