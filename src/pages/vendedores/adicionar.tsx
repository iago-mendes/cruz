import {useState} from 'react'
import Head from 'next/head'
import {useSession} from 'next-auth/client'
import {useRouter} from 'next/router'

import Container from '../../styles/pages/vendedores/adicionar'
import SellerForm from '../../components/forms/Seller'
import Loading from '../../components/Loading'
import User from '../../utils/userType'
import NotAllowed from '../../components/NotAllowed'

const AddCompany: React.FC = () =>
{
	const Router = useRouter()

	const [session, loading] = useSession()
	const [nome, setNome] = useState('')
	
	if (loading) return <Loading />
	
	const {user: tmpUser}:{user: any} = session
	const user: User = tmpUser

	if (user.role !== 'admin')
		return <NotAllowed />

	return (
		<Container className="container">
			<Head>
				<title>{nome} | Cruz Representações</title>
			</Head>

			{/* <main> */}
				<SellerForm
					method='post'
					nome={nome}
					setNome={setNome}
				/>
			{/* </main> */}
		</Container>
	)
}

export default AddCompany