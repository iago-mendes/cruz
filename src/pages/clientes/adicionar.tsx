import {useState} from 'react'
import Head from 'next/head'
import {useSession} from 'next-auth/client'

import Client from '../../components/forms/Client'
import Loading from '../../components/Loading'
import User from '../../utils/userType'
import NotAllowed from '../../components/NotAllowed'
import Header from '../../components/Header'

const AddClient: React.FC = () =>
{
	const [session, loading] = useSession()
	const [nomeFantasia, setNomeFantasia] = useState('')
	
	if (loading) return <Loading />
	
	const {user: tmpUser}:{user: any} = session
	const user: User = tmpUser

	if (user.role !== 'admin')
		return <NotAllowed />

	return (
		<div className='container'>
			<Head>
				<title>{nomeFantasia} | Cruz Representações</title>
			</Head>

			<Header display={nomeFantasia} />

			<main className='main'>
				<Client
					method='post'
					nome_fantasia={nomeFantasia}
					setNomeFantasia={setNomeFantasia}
				/>
			</main>
		</div>
	)
}

export default AddClient