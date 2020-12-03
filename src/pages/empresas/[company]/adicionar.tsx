import {useState} from 'react'
import Head from 'next/head'
import {useSession} from 'next-auth/client'
import {useRouter} from 'next/router'

import Container from '../../../styles/pages/empresas/[company]/adicionar'
import Header from '../../../components/CompanyHeader'
import LineForm from '../../../components/forms/Line'
import Loading from '../../../components/Loading'
import {User} from '../index'
import NotAllowed from '../../../components/NotAllowed'

const AddCompany: React.FC = () =>
{
	const Router = useRouter()
	const {company} = Router.query

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

			<Header display={nome} />

			<div className="center">
				<LineForm
					method='post'
					company={String(company)}
					nome={nome}
					setNome={setNome}
				/>
			</div>
		</Container>
	)
}

export default AddCompany