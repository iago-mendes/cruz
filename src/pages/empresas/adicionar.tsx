import {useState} from 'react'
import Head from 'next/head'

import Container from '../../styles/pages/empresas/adicionar'
import Header from '../../components/CompanyHeader'
import CompanyForm from '../../components/forms/Company'

const AddCompany: React.FC = () =>
{
	const [nomeFantasia, setNomeFantasia] = useState('')

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