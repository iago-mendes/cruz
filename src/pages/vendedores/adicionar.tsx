import {useState} from 'react'
import Head from 'next/head'
import {useSession} from 'next-auth/client'

import SellerForm from '../../components/forms/Seller'
import Loading from '../../components/Loading'
import User from '../../utils/userType'
import NotAllowed from '../../components/NotAllowed'
import Header from '../../components/Header'

const AddCompany: React.FC = () =>
{
	const [session, loading] = useSession()
	const [nome, setNome] = useState('')
	
	if (loading) return <Loading />
	
	const {user: tmpUser}:{user: any} = session
	const user: User = tmpUser

	if (user.role !== 'admin')
		return <NotAllowed />

	return (
		<div className='container'>
			<Head>
				<title>{nome} | Cruz Representações</title>
			</Head>

			<Header display={nome} />

			<main className='main'>
				<SellerForm
					method='post'
					nome={nome}
					setNome={setNome}
				/>
			</main>
		</div>
	)
}

export default AddCompany