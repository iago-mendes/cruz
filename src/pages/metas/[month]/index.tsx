import React from 'react'
import Head from 'next/head'
import {useRouter} from 'next/router'

import {Container} from '../../../styles/pages/metas/[month]/index'
import Header from '../../../components/Header'
import {formatMonth} from '../../../utils/formatMonth'

const Goal: React.FC = () => {
	const {query} = useRouter()
	const month = String(query.month)

	return (
		<Container className="container">
			<Head>
				<title>Meta | Cruz Representações</title>
			</Head>

			<Header display={`Meta > ${formatMonth(month)}`} />

			<main>
				<h1>{month}</h1>
			</main>
		</Container>
	)
}

export default Goal
