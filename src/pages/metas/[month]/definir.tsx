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

const Goal: React.FC = () => {
	const {query} = useRouter()
	const month = String(query.month)
	const [goalCompanies, setGoalCompanies] = useState<GoalCompanyRaw[]>([])
	const [companies, setCompanies] = useState<CompanyListed[]>([])
	const [sellers, setSellers] = useState<SellerListed[]>([])
	const [expandedCompanies, setExpandedCompanies] = useState<string[]>([])

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
		})
	}, [month])

	function toggleExpandStatus(companyId: string) {
		const tmpExpandedCompanies = [...expandedCompanies]
		const existingIndex = tmpExpandedCompanies.findIndex(id => companyId === id)

		if (existingIndex < 0) tmpExpandedCompanies.push(companyId)
		else tmpExpandedCompanies.splice(existingIndex, 1)

		setExpandedCompanies(tmpExpandedCompanies)
	}

	return (
		<Container className="container">
			<Head>
				<title>Meta | Cruz Representações</title>
			</Head>

			<Header display={`Definir metas > ${formatMonth(month)}`} />

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

					let companyGoal = 0
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
										setValue={() => {}}
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
												setValue={() => {}}
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
		</Container>
	)
}

export default Goal
