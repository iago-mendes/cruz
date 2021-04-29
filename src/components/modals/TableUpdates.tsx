import { useEffect, useState } from 'react'
import { FiMinus, FiPlus } from 'react-icons/fi'
import Select from 'react-select'

import { SelectOption } from '../../models'
import api from '../../services/api'
import Container from '../../styles/components/modals/TableUpdates'
import { selectStyles } from '../../styles/global'
import FormButtons from '../FormButtons'
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
	const [relatedTables, setRelatedTables] = useState<Array<{id: string, relation: number}>>([])
	
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

	function handleAddRelatedTable()
	{
		let tmpRelatedTables = [...relatedTables]
		tmpRelatedTables.push({id: '', relation: 1})

		setRelatedTables(tmpRelatedTables)
	}

	function handleRemoveRelatedTable(index: number)
	{
		let tmpRelatedTables = [...relatedTables]
		tmpRelatedTables.splice(index, 1)

		setRelatedTables(tmpRelatedTables)
	}

	function handleCancel()
	{}

	function handleSubmit()
	{}

	return (
		<ModalContainer
			isOpen={isOpen}
			setIsOpen={setIsOpen}
		>
			<Container>
				<h1>Atualização de tabelas</h1>
				<div className='target'>
					<label>Tabela principal</label>
					<Select
						value={targetTableOptions.find(option => option.value === targetTable.id)}
						options={targetTableOptions}
						onChange={option => setTargetTable({id: option.value, change: 1})}
						styles={selectStyles}
					/>

					<label>Mudança</label>
					<div className='changeGroup'>
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
					<h2>Tabelas relacionadas</h2>

					{relatedTables.map((table, index) => (
						<div className='table' key={index} >
							<label>Tabela</label>
							<Select
								options={relatedTableOptions}
								styles={selectStyles}
							/>

							<label>Relação</label>
							<div className='changeGroup'>
								<Select
									options={changeOptions}
									styles={selectStyles}
								/>
								<NumberInput
									value={targetTable.change}
									setValue={n => setTargetTable({id: targetTable.id, change: n})}
								/>
							</div>

							<button className='listButton remove' onClick={() => handleRemoveRelatedTable(index)}>
								<FiMinus />
								<span>
									Remover representada
								</span>
							</button>
						</div>
					))}

					<button className='listButton add' onClick={handleAddRelatedTable}>
						<FiPlus />
						<span>
							Adicionar tabela
						</span>
					</button>
				</ul>

				<FormButtons
					handleCancel={handleCancel}
					handleSubmit={handleSubmit}
				/>
			</Container>
		</ModalContainer>
	)
}

export default TableUpdatesModal