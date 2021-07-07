import React, {useEffect, useState} from 'react'
import Head from 'next/head'
import {useRouter} from 'next/router'
import {BsFillTriangleFill} from 'react-icons/bs'
import {motion} from 'framer-motion'

import {
	Container,
	DropdownGroup,
	GoalCompany
} from '../../../styles/pages/metas/[month]/index'
import Header from '../../../components/Header'
import {formatMonth} from '../../../utils/formatMonth'
import {GoalShowed, loadingGoal, notFoundGoal} from '../../../models/goal'
import {goalController} from '../../../services/offline/controllers/goal'
import GoalChart from '../../../components/GoalChart'
import formatPrice from '../../../utils/formatPrice'

const Goal: React.FC = () => {
	const {query} = useRouter()
	const month = String(query.month)

	const [goal, setGoal] = useState<GoalShowed>(loadingGoal)
	const [expandedCompanies, setExpandedCompanies] = useState<string[]>([])
	const [isCompaniesExpanded, setIsCompaniesExpanded] = useState(false)
	const [isClientsExpanded, setIsClientsExpanded] = useState(false)

	useEffect(() => {
		goalController
			.show(month)
			.then(goal => {
				if (goal) setGoal(goal)
			})
			.catch(() => setGoal(notFoundGoal))
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

			<Header display={`Meta > ${formatMonth(month)}`} />

			<main className="main">
				<GoalChart month={month} goal={goal} />

				<DropdownGroup isExpanded={isCompaniesExpanded}>
					<header onClick={() => setIsCompaniesExpanded(!isCompaniesExpanded)}>
						<div className="indicator">
							<BsFillTriangleFill />
						</div>

						<h2>Detalhes por empresa</h2>
					</header>
					<motion.ul
						initial={false}
						transition={{duration: 0.2}}
						animate={isCompaniesExpanded ? 'open' : 'closed'}
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
						{goal.companies.map(company => (
							<GoalCompany
								key={company.id}
								isExpanded={expandedCompanies.includes(company.id)}
							>
								<header onClick={() => toggleExpandStatus(company.id)}>
									<div className="indicator">
										<BsFillTriangleFill />
									</div>

									<h3>{company.name}</h3>

									<span>
										{formatPrice(company.sold)} / {formatPrice(company.goal)}
									</span>
								</header>

								<motion.ul
									initial={false}
									transition={{duration: 0.2}}
									animate={
										expandedCompanies.includes(company.id) ? 'open' : 'closed'
									}
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
										<label>E-Commerce</label>
										<span>
											{formatPrice(company.eCommerceSold)} /{' '}
											{formatPrice(company.eCommerceGoal)}
										</span>
									</li>
									{company.sellers.map(seller => (
										<li key={seller.id}>
											<label>E-Commerce</label>
											<span>
												{formatPrice(seller.sold)} / {formatPrice(seller.goal)}
											</span>
										</li>
									))}
								</motion.ul>
							</GoalCompany>
						))}
					</motion.ul>
				</DropdownGroup>

				<DropdownGroup isExpanded={isClientsExpanded}>
					<header onClick={() => setIsClientsExpanded(!isClientsExpanded)}>
						<div className="indicator">
							<BsFillTriangleFill />
						</div>

						<h2>Detalhes por vendedor</h2>
					</header>
					<motion.ul
						initial={false}
						transition={{duration: 0.2}}
						animate={isClientsExpanded ? 'open' : 'closed'}
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
						{goal.sellers.map(seller => (
							<li key={seller.id} className="seller">
								<h2>{seller.name}</h2>

								<span>
									{formatPrice(seller.sold)} / {formatPrice(seller.goal)}
								</span>
							</li>
						))}
					</motion.ul>
				</DropdownGroup>
			</main>
		</Container>
	)
}

export default Goal
