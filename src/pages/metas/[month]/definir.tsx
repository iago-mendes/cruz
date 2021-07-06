import {useEffect, useState} from 'react'
import Head from 'next/head'
import {useRouter} from 'next/router'
import {BsFillTriangleFill} from 'react-icons/bs'
import {motion} from 'framer-motion'

import {
	Container,
	GoalCompany
} from '../../../styles/pages/metas/[month]/definir'
import {GoalCompanyRaw} from '../../../models/goal'
import {goalController} from '../../../services/offline/controllers/goal'
import {CompanyListed} from '../../../models/company'
import {SellerListed} from '../../../models/seller'
import {companyController} from '../../../services/offline/controllers/company'
import {sellerController} from '../../../services/offline/controllers/seller'
import Header from '../../../components/Header'
import {formatMonth} from '../../../utils/formatMonth'
import formatPrice from '../../../utils/formatPrice'
import NumberInput from '../../../components/NumberInput'
import FormButtons from '../../../components/FormButtons'
import api from '../../../services/api'
import successAlert from '../../../utils/alerts/success'
import {catchError} from '../../../utils/catchError'

const Goal: React.FC = () => {
	const {query, back} = useRouter()
	const month = String(query.month)

	const [goalCompanies, setGoalCompanies] = useState<GoalCompanyRaw[]>([])
	const [companies, setCompanies] = useState<CompanyListed[]>([])
	const [sellers, setSellers] = useState<SellerListed[]>([])
	const [expandedCompanies, setExpandedCompanies] = useState<string[]>([])
	const [goalExists, setGoalExists] = useState(false)

	useEffect(() => {
		companyController.list().then(companies => {
			if (companies) setCompanies(companies)
		})

		sellerController.list().then(sellers => {
			if (sellers) setSellers(sellers)
		})
	}, [])

	useEffect(() => {
		goalController.rawOne(month).then(goal => {
			if (goal) setGoalCompanies(goal.companies)
			setGoalExists(goal != undefined)
		})
	}, [month])

	function toggleExpandStatus(companyId: string) {
		const tmpExpandedCompanies = [...expandedCompanies]
		const existingIndex = tmpExpandedCompanies.findIndex(id => companyId === id)

		if (existingIndex < 0) tmpExpandedCompanies.push(companyId)
		else tmpExpandedCompanies.splice(existingIndex, 1)

		setExpandedCompanies(tmpExpandedCompanies)
	}

	function getOptions() {
		const options: Array<{
			display: string
			action: () => void
			color?: string
		}> = []

		options.push({action: handleSubmit, display: 'Confirmar'})
		options.push({action: back, display: 'Cancelar', color: '#f00'})
		if (goalExists)
			options.push({
				action: handleDeleteGoal,
				display: 'Deletar',
				color: '#f00'
			})

		return options
	}

	function handleECommerceGoalChange(value: number, companyId: string) {
		const tmpGoalCompanies = [...goalCompanies]
		const existingIndex = tmpGoalCompanies.findIndex(({id}) => id === companyId)

		if (existingIndex < 0)
			tmpGoalCompanies.push({
				id: companyId,
				eCommerceGoal: value,
				sellers: []
			})
		else tmpGoalCompanies[existingIndex].eCommerceGoal = value

		setGoalCompanies(tmpGoalCompanies)
	}

	function handleSellerGoalChange(
		value: number,
		companyId: string,
		sellerId: string
	) {
		const tmpGoalCompanies = [...goalCompanies]
		const existingCompanyIndex = tmpGoalCompanies.findIndex(
			({id}) => id === companyId
		)

		if (existingCompanyIndex < 0)
			tmpGoalCompanies.push({
				id: companyId,
				eCommerceGoal: 0,
				sellers: [
					{
						id: sellerId,
						goal: value
					}
				]
			})
		else {
			const existingSellerIndex = tmpGoalCompanies[
				existingCompanyIndex
			].sellers.findIndex(({id}) => id === sellerId)

			if (existingSellerIndex < 0)
				tmpGoalCompanies[existingCompanyIndex].sellers.push({
					id: sellerId,
					goal: value
				})
			else
				tmpGoalCompanies[existingCompanyIndex].sellers[
					existingSellerIndex
				].goal = value
		}

		setGoalCompanies(tmpGoalCompanies)
	}

	async function handleDeleteGoal() {
		if (!goalExists) return

		await api
			.delete(`goals/${month}`)
			.then(() => {
				successAlert('Meta deletada com sucesso!')
				back()
			})
			.catch(catchError)
	}

	async function handleSubmit() {
		const data = {
			month,
			companies: goalCompanies
		}

		if (!goalExists)
			await api
				.post('goals', data)
				.then(() => {
					successAlert('Meta criada com sucesso!')
					back()
				})
				.catch(catchError)
		else
			await api
				.put(`goals/${month}`)
				.then(() => {
					successAlert('Meta atualizada com sucesso!')
					back()
				})
				.catch(catchError)
	}

	return (
		<Container className="container">
			<Head>
				<title>Meta | Cruz Representações</title>
			</Head>

			<Header
				display={`Definir metas > ${formatMonth(month)}`}
				options={getOptions()}
			/>

			<form onSubmit={e => e.preventDefault()}>
				<main>
					{companies.map((company, index) => {
						const goalCompany = goalCompanies.find(
							({id}) => company.id === id
						) ?? {
							id: `not found - ${index}`,
							sellers: [],
							eCommerceGoal: 0
						}

						const isExpanded = expandedCompanies.includes(company.id)

						let companyGoal = goalCompany.eCommerceGoal
						goalCompany.sellers.forEach(({goal}) => (companyGoal += goal))

						return (
							<GoalCompany isExpanded={isExpanded} key={company.id}>
								<header onClick={() => toggleExpandStatus(company.id)}>
									<div className="indicator">
										<BsFillTriangleFill />
									</div>

									<h2>{company.nome_fantasia}</h2>

									<span>{formatPrice(companyGoal)}</span>
								</header>
								<motion.ul
									initial={false}
									transition={{duration: 0.2}}
									animate={isExpanded ? 'open' : 'closed'}
									variants={{
										open: {
											height: 'fit-content',
											opacity: 1
										},
										closed: {
											height: 0,
											opacity: 0
										}
									}}
								>
									<li>
										<label htmlFor="e-commerce">E-Commerce</label>
										<NumberInput
											value={goalCompany.eCommerceGoal}
											setValue={value =>
												handleECommerceGoalChange(value, company.id)
											}
											name="e-commerce"
										/>
									</li>
									{sellers.map((seller, index) => {
										const goalSeller = goalCompany.sellers.find(
											({id}) => seller.id === id
										) ?? {
											id: `not found - ${index}`,
											goal: 0
										}

										return (
											<li key={seller.id}>
												<label htmlFor={seller.id}>{seller.nome}</label>
												<NumberInput
													value={goalSeller.goal}
													setValue={value =>
														handleSellerGoalChange(value, company.id, seller.id)
													}
													name={seller.id}
												/>
											</li>
										)
									})}
								</motion.ul>
							</GoalCompany>
						)
					})}
				</main>
				<FormButtons handleCancel={back} handleSubmit={handleSubmit} />
			</form>
		</Container>
	)
}

export default Goal
