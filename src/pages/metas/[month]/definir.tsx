import {useState} from 'react'
import Head from 'next/head'
import {useRouter} from 'next/router'

import {GoalRaw} from '../../../models/goal'

import Container from '../../../styles/pages/metas/[month]'

const Goal: React.FC = () => {
	const {query} = useRouter()
	const month = String(query.month)
	const [goal, setGoal] = useState<GoalRaw>()

	return (
		<Container>
			<Head>
				<title>Meta | Cruz Representações</title>
			</Head>
		</Container>
	)
}

export default Goal
