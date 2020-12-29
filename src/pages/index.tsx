import {GetStaticProps} from 'next'
import {useSession} from 'next-auth/client'
import Head from 'next/head'
import {useRouter} from 'next/router'
import {useEffect, useState} from 'react'
import useSWR from 'swr'
import {FiEdit3, FiTrash} from 'react-icons/fi'
import {BiBuildings} from 'react-icons/bi'
import {FiUsers} from 'react-icons/fi'
import {FaStore} from 'react-icons/fa'

import Container from '../styles/pages/index'
import {ListedRequest as Request} from '../components/forms/Request'
import Header from '../components/Header'
import Loading from '../components/Loading'
import api from '../services/api'
import Add from '../components/Add'
import User from '../utils/userType'

interface RequestsProps
{
	requests: Request[]
}

const Requests: React.FC<RequestsProps> = ({requests: staticRequests}) =>
{
	const Router = useRouter()
	const [session, loading] = useSession()
	
	const [requests, setRequests] = useState<Request[]>([])
	const {data, error, revalidate} = useSWR('/api/getRequests')

	useEffect(() =>
	{
		if (data)
			setRequests(data)
		else
		{
			setRequests(staticRequests)

			if (error)
				console.error(error)
		}
	}, [data, error, staticRequests])

	useEffect(() => console.log('[requests]', requests), [requests])

	if (loading)
		return <Loading />

	const {user: tmpUser}:{user: any} = session
	const user: User = tmpUser

	return (
		<Container className='container'>
			<Head>
				<title>Pedidos | Cruz Representações</title>
			</Head>

			<Add route='/novo-pedido' />
			<Header display='Pedidos' />

			<main className='main'>
				{requests.map(request => (
					<div className='request' key={request.id}>
						<div className="header">
							<div className="typeDate">
								{request.tipo.venda && (
									<span style={{backgroundColor: '#357435'}}>
										venda
									</span>
								)}
								{request.tipo.troca && (
									<span style={{backgroundColor: '#2b2b68'}}>
										troca
									</span>
								)}
								{request.data}
							</div>
							<div className="status">
								<span style={{backgroundColor: request.status.concluido ? '#16881a' : '#881616'}} >
									{request.status.concluido ? 'concluído' : 'pendente' }
								</span>
								<span style={{backgroundColor: request.status.enviado ? '#16881a' : '#881616'}} >
									{request.status.enviado ? 'enviado' : 'não enviado' }
								</span>
								<span style={{backgroundColor: request.status.faturado ? '#16881a' : '#881616'}} >
									{request.status.faturado ? 'faturado' : 'não faturado' }
								</span>
							</div>
						</div>
						<ul>
							<li>
								<FaStore size={20} />
								{request.cliente}
							</li>
							<li>
								<BiBuildings size={20} />
								{request.representada}
							</li>
							<li>
								<FiUsers size={20} />
								{request.vendedor}
							</li>
						</ul>
					</div>
				))}
			</main>

		</Container>
	)
}

export const getStaticProps: GetStaticProps = async ctx =>
{
	let requests: Request[] = []

	await api.get('requests').then(({data}) => requests = data)

	return {
		props: {requests},
		revalidate: 1
	}
}

export default Requests