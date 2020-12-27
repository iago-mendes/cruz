import {GetStaticProps} from 'next'
import Head from 'next/head'
import {useEffect, useState} from 'react'
import useSWR from 'swr'

import {Client} from '../../components/forms/Client'
import api from '../../services/api'

import Container from '../../styles/pages/clientes/index'

interface ClientsProps
{
	clients: Client[]
}

const Clients: React.FC<ClientsProps> = ({clients: staticClients}) =>
{
	const [clients, setClients] = useState<Client[]>([])
	const {data, error, revalidate} = useSWR('/api/getClients')

	useEffect(() =>
	{
		if (data)
			setClients(data)
		else if (staticClients)
		{
			setClients(staticClients)

			if (error)
				console.error(error)
		}
	}, [data, error, staticClients])

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