import Head from 'next/head'
import {FiEdit3} from 'react-icons/fi'
import {BiBuildings, BiSearch} from 'react-icons/bi'
import {getSession, useSession} from 'next-auth/client'
import {GetServerSideProps} from 'next'

import api from '../../../services/api'
import Loading from '../../../components/Loading'
import NotLogged from '../../../components/NotLogged'

interface User
{
	token: string
	role: string
}

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
	else if (!session) return <NotLogged />
	
	const {user: tmpUser}:{user: any} = session
	const user: User = tmpUser
	
	return (
		<div className="container" id="company">
			<Head>
				<title>{companyName} | Cruz Representações</title>
			</Head>

			<header>
				<div className="group">
					<BiBuildings size={30} />
					<h1>{companyName} {'>'} Linhas</h1>
				</div>
				<div className="group">
				<div />
			<div className="inputField">
			<BiSearch size={25} color='rgb(138, 138, 138)' />
			<input type="text" name="search"/>
			</div>
			</div>
			</header>
		<main>
		{lines && lines.map(line => (
			<div key={line.id} className="line">
			<img src={line.imagem} alt={line.nome} />
			<h1>{line.nome}</h1>
			{
				user.role === 'admin' ?
				<button title="Editar"><FiEdit3 size={15} /></button>
				: <div />
			}
			</div>
			))}
			</main>
		</div>
	)
}

export const getServerSideProps: GetServerSideProps = async ctx =>
{
	const {company} = ctx.params

	let lines = []
	await api.get(`companies/${company}/products`)
		.then(res => lines = res.data)
		.catch(err => console.error(err.message))

	let companyName = ''
	await api.get(`companies/${company}`)
		.then(res => companyName = res.data.nome_fantasia)
		.catch(err => console.error(err.message))

	return {
		props: {lines, companyName}
	}
}

export default Lines