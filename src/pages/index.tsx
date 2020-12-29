import {GetStaticProps} from 'next'
import {useSession} from 'next-auth/client'
import Head from 'next/head'
import {useRouter} from 'next/router'
import {useEffect, useState} from 'react'
import useSWR from 'swr'
import {FiEdit3, FiTrash} from 'react-icons/fi'


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
			<Header display='Pedidos' showSearch />

			<main className='main'>
				
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