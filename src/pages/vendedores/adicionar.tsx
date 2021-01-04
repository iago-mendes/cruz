import {useState} from 'react'
import Head from 'next/head'

import SellerForm from '../../components/forms/Seller'
import Loading from '../../components/Loading'
import NotAllowed from '../../components/NotAllowed'
import Header from '../../components/Header'
import useUser from '../../hooks/useUser'

const AddCompany: React.FC = () =>
{
	const {user, loading} = useUser()
	const [nome, setNome] = useState('')
	
	if (loading)
		return <Loading />
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