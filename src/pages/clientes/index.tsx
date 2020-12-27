import {GetStaticProps} from 'next'
import Head from 'next/head'
import {useEffect} from 'react'

import {Client} from '../../components/forms/Client'
import api from '../../services/api'

import Container from '../../styles/pages/clientes/index'

interface ClientsProps
{
	clients: Client[]
}

const Clients: React.FC<ClientsProps> = ({clients: staticClients}) =>
{
	useEffect(() => console.log('[staticClients]', staticClients), [staticClients])

	return (
		<Container>
			<Head>
				<title>Clientes | Cruz Representações</title>
			</Head>
		</Container>
	)
}

export const getStaticProps: GetStaticProps = async ctx =>
{
	let clients: Client[] = []

	await api.get('clients-raw').then(({data}) => clients = data)

	return {
		props: {clients},
		revalidate: 1
	}
}

export default Clients