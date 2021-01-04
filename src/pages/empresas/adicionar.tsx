import {useState} from 'react'
import Head from 'next/head'

import Container from '../../styles/pages/empresas/adicionar'
import Header from '../../components/Header'
import CompanyForm from '../../components/forms/Company'
import Loading from '../../components/Loading'
import NotAllowed from '../../components/NotAllowed'
import useUser from '../../hooks/useUser'

const AddCompany: React.FC = () =>
{
	const {user, loading} = useUser()
	const [nomeFantasia, setNomeFantasia] = useState('')
	
	if (loading)
		return <Loading />
	if (user.role !== 'admin')
		return <NotAllowed />

	return (
		<Container className="container">
			<Head>
				<title>{nomeFantasia} | Cruz Representações</title>
			</Head>

			<Header display={nomeFantasia} />

			<main>
				<CompanyForm
					method='post'
					nomeFantasia={nomeFantasia}
					setNomeFantasia={setNomeFantasia}
				/>
			</main>
		</Container>
	)
}

export default AddCompany