import {useRouter} from 'next/router'
import {useState} from 'react'
import Head from 'next/head'
import {GetServerSideProps} from 'next'

import api from '../../../services/api'
import Header from '../../../components/CompanyHeader'
import CompanyForm, {Company} from '../../../components/forms/Company'

interface EditCompanyProps
{
	company: Company
}

const EditCompany: React.FC<EditCompanyProps> = ({company}) =>
{
	const Router = useRouter()
	const [nomeFantasia, setNomeFantasia] = useState('')

	const {company: id} = Router.query
	if (!id) return <h1>Carregando...</h1>

	return (
		<div className="container" id="editCompany">
			<Head>
					<title>{nomeFantasia} | Cruz Representações</title>
			</Head>

			<Header display={nomeFantasia} />

			<CompanyForm
				method='put'
				nomeFantasia={nomeFantasia}
				setNomeFantasia={setNomeFantasia}
				id={id as string}
				company={company}
			/>
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