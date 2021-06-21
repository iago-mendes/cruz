import Head from 'next/head'
import { useState, useEffect } from 'react'
import GoalChart from '../components/GoalChart'

import Header from '../components/Header'
import { loadingGoal } from '../models/goal'
import { goalController } from '../services/offline/controllers/goal'
import { getMonth } from '../utils/getDate'

const Indicators: React.FC = () =>
{
	const [month, setMonth] = useState(getMonth())
	const [goal, setGoal] = useState(loadingGoal)

	useEffect(() =>
	{
		goalController.show(month)
			.then(data => setGoal(data))
			.catch(() => {})
	}, [])

	return (
		<div className='container' >
			<Head>
				<title>Indicadores | Cruz Representações</title>
			</Head>

			<Header
				display='Indicadores'
			/>

			<main>
				<GoalChart
					month={month}
					goal={goal}
				/>
			</main>
		</div>
	)
}

export default Indicators