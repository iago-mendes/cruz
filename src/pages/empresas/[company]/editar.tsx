import {useRouter} from 'next/router'
import {useState} from 'react'
import Head from 'next/head'
import {GetServerSideProps} from 'next'

import api from '../../../services/api'
import Header from '../../../components/Header'
import CompanyForm, {Company} from '../../../components/forms/Company'
import Loading from '../../../components/Loading'
import NotAllowed from '../../../components/NotAllowed'
import useUser from '../../../hooks/useUser'

interface EditCompanyProps
{
	company: Company
}

const EditCompany: React.FC<EditCompanyProps> = ({company}) =>
{
	const Router = useRouter()
	const [nomeFantasia, setNomeFantasia] = useState('')
	const {user, loading} = useUser()

	const {company: id} = Router.query
	if (!id) return <Loading />

	if (loading)
		return <Loading />
	if (user.role !== 'admin')
		return <NotAllowed />

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
					id={id as string}
					company={company}
				/>
			</main>
		</div>
	)
}

export const getServerSideProps: GetServerSideProps = async ctx =>
{
	const {company: id} = ctx.params

	const {data: company} = await api.get(`companies-all/${id}`)

	return {
		props: {company}
	}
}

export default EditCompany