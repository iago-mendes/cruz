import {useState} from 'react'
import Head from 'next/head'
import {useSession} from 'next-auth/client'

import Container from '../../styles/pages/empresas/adicionar'
import Header from '../../components/CompanyHeader'
import CompanyForm from '../../components/forms/Company'
import Loading from '../../components/Loading'
import {User} from './index'
import NotAllowed from '../../components/NotAllowed'

const AddCompany: React.FC = () =>
{
	const [session, loading] = useSession()
	const [nomeFantasia, setNomeFantasia] = useState('')
	
	if (loading) return <Loading />
	
	const {user: tmpUser}:{user: any} = session
	const user: User = tmpUser

	if (user.role !== 'admin')
		return <NotAllowed />

	return (
		<Container className="container">
			<Head>
				<title>{nomeFantasia} | Cruz Representações</title>
			</Head>

			<Header display={nomeFantasia} />

			<CompanyForm
				method='post'
				nomeFantasia={nomeFantasia}
				setNomeFantasia={setNomeFantasia}
			/>
		</Container>
	)
}

export default AddCompany