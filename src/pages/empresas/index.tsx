import Head from 'next/head'
import {FiEdit3} from 'react-icons/fi'
import {useRouter} from 'next/router'
import {GetStaticProps } from 'next'
import {useSession} from 'next-auth/client'

import api from '../../services/api'
import Loading from '../../components/Loading'
import Header from '../../components/CompanyHeader'
import Container from '../../styles/pages/empresas/index'

interface User
{
	id: string
	role: string
}

interface CompaniesProps
{
	companies: Array<
	{
		id: string
		imagem: string
		nome_fantasia: string
		descricao_curta: string
	}>
}

const Companies: React.FC<CompaniesProps> = ({companies}) =>
{
	const Router = useRouter()
	const [session, loading] = useSession()

	if (loading) return <Loading />

	const {user: tmpUser}:{user: any} = session
	const user: User = tmpUser

	return (
		<Container className="container">
			<Head>
				<title>Empresas | Cruz Representações</title>
			</Head>

			<Header display='Empresas' addRoute='/empresas/adicionar' showSecondGroup />

			<main>
				{companies.map(company => (
					<div key={company.id} className="company">
						<img src={company.imagem} alt={company.nome_fantasia}/>
						<div className="companyText">
							<h1 onClick={() => Router.push(`/empresas/${company.id}`)}>
								{company.nome_fantasia}
							</h1>
							<h2>{company.descricao_curta}</h2>
						</div>
						{
							user.role === 'admin' ?
							<button title="Editar" onClick={() => Router.push(`/empresas/${company.id}/editar`)}>
								<FiEdit3 size={25} />
							</button>
							: <div />
						}
					</div>
				))}
			</main>
		</Container>
	)
}

export const getStaticProps: GetStaticProps = async ctx =>
{
	let companies = []
	await api.get('companies')
		.then(res => companies = res.data)
		.catch(err => console.error(err.message))

	return {
		props: {companies},
		revalidate: 1
	}
}

export default Companies