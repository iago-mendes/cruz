import Head from 'next/head'
import {FiEdit3, FiTrash} from 'react-icons/fi'
import {useRouter} from 'next/router'
import {GetStaticProps} from 'next'
import {useState} from 'react'

import api from '../../services/api'
import Header from '../../components/Header'
import Container from '../../styles/pages/empresas/index'
import Add from '../../components/Add'
import useUser from '../../hooks/useUser'
import {CompanyListed} from '../../models/company'
import Link from 'next/link'
import confirmAlert from '../../utils/alerts/confirm'

interface CompaniesProps
{
	companies: CompanyListed[]
}

const Companies: React.FC<CompaniesProps> = ({companies: staticCompanies}) =>
{
	const Router = useRouter()
	const {user} = useUser()

	const [companies, setCompanies] = useState<CompanyListed[]>(staticCompanies)

	async function updateCompanies()
	{
		api.get('companies')
			.then(({data}:{data: CompanyListed[]}) =>
			{
				setCompanies(data)
			})
			.catch(error =>
			{
				console.log('[error]', error)
				setCompanies(staticCompanies)
			})
	}

	async function handleDeleteCompany(company: CompanyListed)
	{
		confirmAlert(
			'Você tem certeza?',
			`Se você continuar, a empresa ${company.nome_fantasia} será deletada!`,
			() => api.delete(`companies/${company.id}`)
				.then(() =>
				{
					updateCompanies()
					alert(`Empresa ${company.nome_fantasia} deletada com sucesso!`)
				})
		)
	}

	return (
		<Container className='container'>
			<Head>
				<title>Empresas | Cruz Representações</title>
			</Head>

			<Header display='Empresas' />
			<Add route='/empresas/adicionar' />

			<main>
				{companies.map(company => (
					<div key={company.id} className='company'>
						<img src={company.imagem} alt={company.nome_fantasia}/>
						<div className='companyText'>
							<Link href={`/empresas/${company.id}`} >
								<a className='name'>
									{company.nome_fantasia}
								</a>
							</Link>
							<span className='description' >
								{company.descricao_curta}
							</span>
						</div>
						{
							user.role === 'admin' ?
							<>
									<button title='Editar' onClick={() => Router.push(`/empresas/${company.id}/editar`)}>
										<FiEdit3 size={25} />
									</button>
									<button title='Deletar' onClick={() => handleDeleteCompany(company)} >
										<FiTrash size={25} />
									</button>
							</>
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
	const companies = await api.get('companies').then(({data}:{data: CompanyListed[]}) => data)

	return {
		props: {companies},
		revalidate: 1
	}
}

export default Companies