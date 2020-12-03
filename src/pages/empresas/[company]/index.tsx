import Head from 'next/head'
import {FiEdit3, FiTrash} from 'react-icons/fi'
import {useSession} from 'next-auth/client'
import {GetStaticPaths, GetStaticProps} from 'next'

import api from '../../../services/api'
import Loading from '../../../components/Loading'
import Header from '../../../components/CompanyHeader'
import Container from '../../../styles/pages/empresas/[company]/index'
import {User} from '../index'

interface LinesProps
{
	companyName: string
	lines: Array<
	{
		id: string
		nome: string
		imagem: string
	}>
}

const Lines: React.FC<LinesProps> = ({lines, companyName}) =>
{
	const [session, loading] = useSession()
	
	if (loading) return <Loading />
	
	const {user: tmpUser}:{user: any} = session
	const user: User = tmpUser
	
	return (
		<Container className="container">
			<Head>
				<title>{companyName} | Cruz Representações</title>
			</Head>

			<Header display={`${companyName} > Linhas`} showSecondGroup />

			<div className="scroll">
				<main>
					{lines && lines.map(line => (
						<div key={line.id} className="line">
							<div className="buttons">
							{
								user.role === 'admin' && (
									<>
										<button title="Editar" onClick={() => {}} >
											<FiEdit3 size={15} />
										</button>
										<button title='Deletar' onClick={() => {}} >
											<FiTrash size={15} />
										</button>
									</>
								)
							}
							</div>
							<div className="img">
								<img src={line.imagem} alt={line.nome} />
							</div>
							<h1>{line.nome}</h1>
						</div>
					))}
				</main>
			</div>
		</Container>
	)
}

export const getStaticPaths: GetStaticPaths = async ctx =>
{
	const companies = await api.get('companies').then(res => res.data.map(company => (
	{
		params: {company: company.id}
	})))

	return {
		paths: companies,
		fallback: true
	}
}

export const getStaticProps: GetStaticProps = async ctx =>
{
	const {company} = ctx.params

	let lines = []
	await api.get(`companies/${company}/lines`)
		.then(res => lines = res.data)
		.catch(err => console.error(err.message))

	let companyName = ''
	await api.get(`companies/${company}`)
		.then(res => companyName = res.data.nome_fantasia)
		.catch(err => console.error(err.message))

	return {
		props: {lines, companyName},
		revalidate: 1
	}
}

export default Lines