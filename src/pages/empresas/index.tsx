import Head from 'next/head'
import {FiEdit3, FiTrash} from 'react-icons/fi'
import {useRouter} from 'next/router'
import {useEffect, useState} from 'react'

import api from '../../services/api'
import Header from '../../components/Header'
import Container from '../../styles/pages/empresas/index'
import Add from '../../components/Add'
import useAuth from '../../hooks/useAuth'
import {CompanyListed} from '../../models/company'
import Link from 'next/link'
import confirmAlert from '../../utils/alerts/confirm'
import { Image } from '../../components/Image'
import { companyController } from '../../services/offline/controllers/company'

const Companies: React.FC = () =>
{
	const Router = useRouter()
	const {user} = useAuth()

	const [companies, setCompanies] = useState<CompanyListed[]>([])

	useEffect(() =>
	{
		updateCompanies()
	}, [])

	async function updateCompanies()
	{
		await companyController.list()
			.then(data => setCompanies(data))
			.catch(error =>
			{
				console.log('<< error >>', error)
				setCompanies([])
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
						<Image src={company.imagem} alt={company.nome_fantasia}/>
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
								<div className='actions'>
									<button
										title='Editar'
										onClick={() => Router.push(`/empresas/${company.id}/editar`)}
										className='edit'
									>
										<FiEdit3 />
									</button>
									<button
										title='Deletar'
										onClick={() => handleDeleteCompany(company)}
										className='delete'
									>
										<FiTrash />
									</button>
								</div>
								: <div />
						}
					</div>
				))}
			</main>
		</Container>
	)
}

export default Companies