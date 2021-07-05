import {useEffect, useState} from 'react'
import {FiMinus, FiPlus} from 'react-icons/fi'
import Select from 'react-select'

import {SelectOption} from '../../models'
import api from '../../services/api'
import {companyController} from '../../services/offline/controllers/company'
import Container from '../../styles/components/modals/TableUpdates'
import {selectStyles} from '../../styles/global'
import errorAlert from '../../utils/alerts/error'
import successAlert from '../../utils/alerts/success'
import FormButtons from '../FormButtons'
import NumberInput from '../NumberInput'
import ModalContainer from './Container'

type CompanyTable = {
	id: string
	nome: string
}

type Props = {
	isOpen: boolean
	setIsOpen: (p: boolean) => void

	companyId: string

	callback?: () => void
}

const TableUpdatesModal: React.FC<Props> = ({
	isOpen,
	setIsOpen,
	companyId,
	callback = () => {}
}) => {
	const [targetTable, setTargetTable] = useState({id: '', change: 1})
	const [relatedTables, setRelatedTables] = useState<
		Array<{id: string; relation: number}>
	>([])

	const [companyTables, setCompanyTables] = useState<CompanyTable[]>([])
	const [targetChangeOption, setTargetChangeOption] = useState('increase')
	const [relatedTablesRelationOption, setRelatedTablesRelationOption] =
		useState<string[]>([])

	const targetTableOptions: SelectOption[] = companyTables.map(table => ({
		label: table.nome,
		value: table.id
	}))

	const relatedTableOptions: SelectOption[] = companyTables
		.filter(table => table.id !== targetTable.id)
		.map(table => ({
			label: table.nome,
			value: table.id
		}))

	const changeOptions: SelectOption[] = [
		{label: 'Acréscimo', value: 'increase'},
		{label: 'Desconto', value: 'decrease'}
	]

	useEffect(() => {
		companyController.rawOne(companyId).then(company => {
			const tmpCompanyTables = company.tabelas.map(table => ({
				id: String(table._id),
				nome: table.nome
			}))
			setCompanyTables(tmpCompanyTables)

			const tmpTargetTable = {id: tmpCompanyTables[0].id, change: 1}
			setTargetTable(tmpTargetTable)

			const tmpRelatedTables = !company.relatedTables
				? []
				: company.relatedTables.map(table => ({
						id: table.id,
						relation: table.relation
				  }))
			setRelatedTables(tmpRelatedTables)

			const tmpRelatedTablesRelationOption = tmpRelatedTables.map(table => {
				if (table.relation < 1) return 'decrease'
				else return 'increase'
			})
			setRelatedTablesRelationOption(tmpRelatedTablesRelationOption)
		})
	}, [companyId])

	function getPercentChange(change: number) {
		const percentChange = (change - 1) * 100

		return Math.abs(percentChange)
	}

	function getChange(percentChange: number, changeOption = 'increase') {
		const decimalChange = percentChange / 100

		let change = 1
		if (changeOption === 'increase') change += decimalChange
		if (changeOption === 'decrease') change -= decimalChange

		return change
	}

	function handleTargetTableChange(n: number) {
		const tmpTargetTable = {...targetTable}

		const change = getChange(n, targetChangeOption)
		tmpTargetTable.change = change

		setTargetTable(tmpTargetTable)
	}

	function handleTargetTableChangeOption(option: SelectOption) {
		const tmpTargetTable = {...targetTable}

		const percentChange = getPercentChange(targetTable.change)
		const change = getChange(percentChange, option.value)
		tmpTargetTable.change = change

		setTargetChangeOption(option.value)
		setTargetTable(tmpTargetTable)
	}

	function handleAddRelatedTable() {
		const tmpRelatedTables = [...relatedTables]
		tmpRelatedTables.push({id: '', relation: 1})

		const tmpRelatedTablesRelationOption = [...relatedTablesRelationOption]
		tmpRelatedTablesRelationOption.push('increase')

		setRelatedTables(tmpRelatedTables)
		setRelatedTablesRelationOption(tmpRelatedTablesRelationOption)
	}

	function handleRemoveRelatedTable(index: number) {
		const tmpRelatedTables = [...relatedTables]
		tmpRelatedTables.splice(index, 1)

		const tmpRelatedTablesRelationOption = [...relatedTablesRelationOption]
		tmpRelatedTablesRelationOption.splice(index, 1)

		setRelatedTables(tmpRelatedTables)
		setRelatedTablesRelationOption(tmpRelatedTablesRelationOption)
	}

	function handleRelatedTable(option: SelectOption, index: number) {
		const tmpRelatedTables = [...relatedTables]

		tmpRelatedTables[index] = {id: option.value, relation: 1}

		setRelatedTables(tmpRelatedTables)
	}

	function handleRelatedTableRelation(n: number, index: number) {
		const tmpRelatedTables = [...relatedTables]

		const relationOption = relatedTablesRelationOption[index]
		const relation = getChange(n, relationOption)
		tmpRelatedTables[index].relation = relation

		setRelatedTables(tmpRelatedTables)
	}

	function handleRelatedTableRelationOption(
		option: SelectOption,
		index: number
	) {
		const tmpRelatedTablesRelationOption = [...relatedTablesRelationOption]
		const tmpRelatedTables = [...relatedTables]

		const relatedTable = tmpRelatedTables[index]

		const percentRelation = getPercentChange(relatedTable.relation)
		const relation = getChange(percentRelation, option.value)
		tmpRelatedTables[index].relation = relation

		tmpRelatedTablesRelationOption[index] = option.value

		setRelatedTablesRelationOption(tmpRelatedTablesRelationOption)
		setRelatedTables(tmpRelatedTables)
	}

	function handleCancel() {
		setIsOpen(false)
	}

	async function handleSubmit() {
		const data = {
			targetTable,
			relatedTables
		}

		await api
			.put(`companies/${companyId}/tables`, data)
			.then(() => {
				successAlert('Tabelas atualizadas com sucesso!')
				setIsOpen(false)

				callback()
			})
			.catch(error => {
				errorAlert(error.response.message.data)
			})
	}

	return (
		<ModalContainer isOpen={isOpen} setIsOpen={setIsOpen}>
			<Container>
				<h1>Atualização de tabelas</h1>
				<div className="target">
					<label>Tabela principal</label>
					<Select
						value={targetTableOptions.find(
							option => option.value === targetTable.id
						)}
						options={targetTableOptions}
						onChange={option => setTargetTable({id: option.value, change: 1})}
						styles={selectStyles}
					/>

					<label>Mudança</label>
					<div className="changeGroup">
						<Select
							value={changeOptions.find(
								({value}) => value === targetChangeOption
							)}
							options={changeOptions}
							onChange={handleTargetTableChangeOption}
							styles={selectStyles}
						/>
						<NumberInput
							value={getPercentChange(targetTable.change)}
							setValue={handleTargetTableChange}
						/>
					</div>
				</div>

				<ul className="related">
					<h1>Tabelas relacionadas</h1>

					{relatedTables.map((table, index) => (
						<li className="table" key={index}>
							<div className="group">
								<label>Tabela</label>
								<Select
									value={relatedTableOptions.find(
										({value}) => value === table.id
									)}
									options={relatedTableOptions}
									onChange={option => handleRelatedTable(option, index)}
									styles={selectStyles}
								/>
							</div>

							<div className="group">
								<label>Relação</label>
								<div className="changeGroup">
									<Select
										value={changeOptions.find(
											({value}) => value === relatedTablesRelationOption[index]
										)}
										options={changeOptions}
										onChange={option =>
											handleRelatedTableRelationOption(option, index)
										}
										styles={selectStyles}
									/>
									<NumberInput
										value={getPercentChange(relatedTables[index].relation)}
										setValue={n => handleRelatedTableRelation(n, index)}
									/>
								</div>
							</div>

							<button
								className="listButton remove"
								onClick={() => handleRemoveRelatedTable(index)}
							>
								<FiMinus />
								<span>Remover tabela</span>
							</button>
						</li>
					))}

					<button className="listButton add" onClick={handleAddRelatedTable}>
						<FiPlus />
						<span>Adicionar tabela</span>
					</button>
				</ul>

				<FormButtons handleCancel={handleCancel} handleSubmit={handleSubmit} />
			</Container>
		</ModalContainer>
	)
}

export default TableUpdatesModal
