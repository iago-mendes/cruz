import {useRouter} from 'next/router'
import {useEffect, useState} from 'react'
import Head from 'next/head'
import {GetServerSideProps} from 'next'

import api from '../../../services/api'
import Header from '../../../components/Header'
import CompanyForm from '../../../components/forms/Company'
import Loading from '../../../components/Loading'
import NotAllowed from '../../../components/NotAllowed'
import useUser from '../../../hooks/useUser'
import Company, {defaultCompany} from '../../../models/company'

const EditCompany: React.FC = () =>
{
	const {query} = useRouter()

	const [company, setCompany] = useState<Company>(defaultCompany)
	const [nomeFantasia, setNomeFantasia] = useState('')

	const {company: companyId} = query

	useEffect(() =>
	{
		api.get(`companies-all/${companyId}`).then(({data}) => setCompany(data))
	}, [companyId])

	return (
		<div className='container'>
			<Head>
					<title>{nomeFantasia} | Cruz Representações</title>
			</Head>

			<Header display={nomeFantasia} />

			<main className='main'>
				<CompanyForm
					method='put'
					nomeFantasia={nomeFantasia}
					setNomeFantasia={setNomeFantasia}
					id={String(companyId)}
					company={company}
				/>
			</main>
		</div>
	)
}

export default EditCompany