import {useState} from 'react'
import Head from 'next/head'
import {useRouter} from 'next/router'

import Container from '../../../styles/pages/empresas/[company]/[line]/adicionar'
import Header from '../../../components/Header'
import ProductForm from '../../../components/forms/Product'
import Loading from '../../../components/Loading'
import NotAllowed from '../../../components/NotAllowed'
import useUser from '../../../hooks/useUser'

const AddCompany: React.FC = () =>
{
	const Router = useRouter()
	const {company,line} = Router.query

	const {user, loading} = useUser()
	const [nome, setNome] = useState('')
	
	if (loading)
		return <Loading />
	if (user.role !== 'admin')
		return <NotAllowed />

	return (
		<Container className="container">
			<Head>
				<title>{nome} | Cruz Representações</title>
			</Head>

			<Header display={nome} />

			<main>
				<ProductForm
					method='post'
					companyId={String(company)}
					lineId={String(line)}
					nome={nome}
					setNome={setNome}
				/>
			</main>
		</Container>
	)
}

export default AddCompany