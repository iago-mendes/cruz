import Head from 'next/head'
import {useState, useEffect} from 'react'
import GoalChart from '../components/GoalChart'

import Header from '../components/Header'
import {loadingGoal, notFoundGoal} from '../models/goal'
import {goalController} from '../services/offline/controllers/goal'
import {getMonth} from '../utils/getDate'

const Indicators: React.FC = () => {
	const [month, setMonth] = useState(getMonth())
	const [goal, setGoal] = useState(loadingGoal)

	useEffect(() => {
		setGoal(loadingGoal)

		goalController
			.show(month)
			.then(data => setGoal(data))
			.catch(() => setGoal(notFoundGoal))
	}, [month])

	return (
		<div className="container">
			<Head>
				<title>Indicadores | Cruz Representações</title>
			</Head>

			<Header display="Indicadores" />

			<main className="main">
				<GoalChart
					month={month}
					setMonth={setMonth}
					goal={goal}
					showDetailsButton
				/>
			</main>
		</div>
	)
}

export default Indicators
