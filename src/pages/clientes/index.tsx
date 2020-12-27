import {GetStaticProps} from 'next'
import Head from 'next/head'
import {useEffect, useState} from 'react'
import useSWR from 'swr'
import Add from '../../components/Add'

import {ListedClient as Client} from '../../components/forms/Client'
import Header from '../../components/Header'
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
		<Container className='container'>
			<Head>
				<title>Clientes | Cruz Representações</title>
			</Head>

			<Add route='/clientes/adicionar' />
			<Header display='Clientes' showSearch />

			<main className="main">
				{clients.map(client => (
					<div className="client" key={client.id} >
						<img src={client.imagem} alt={client.nome_fantasia} />
						<div className="names">
							<h1>{client.nome_fantasia}</h1>
							<h2>{client.razao_social}</h2>
						</div>
						<div className="status">
							<span style={{backgroundColor: client.status.ativo ? '#16881a' : '#881616'}} >
								{client.status.ativo ? 'ativo' : 'inativo' }
							</span>
							<span style={{backgroundColor: client.status.aberto ? '#16881a' : '#881616'}} >
								{client.status.aberto ? 'aberto' : 'fechado' }
							</span>
							<span style={{backgroundColor: client.status.nome_sujo ? '#881616' : '#16881a'}} >
								{client.status.nome_sujo ? 'nome sujo' : 'nome limpo' }
							</span>
						</div>
					</div>
				))}
			</main>

		</Container>
	)
}

export const getStaticProps: GetStaticProps = async ctx =>
{
	let clients: Client[] = []

	await api.get('clients').then(({data}) => clients = data)

	return {
		props: {clients},
		revalidate: 1
	}
}

export default Clients