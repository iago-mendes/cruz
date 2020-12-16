import {useRouter} from 'next/router'
import {useState} from 'react'
import Head from 'next/head'
import {GetServerSideProps} from 'next'
import {useSession} from 'next-auth/client'

import api from '../../../services/api'
import Header from '../../../components/Header'
import CompanyForm, {Company} from '../../../components/forms/Company'
import Loading from '../../../components/Loading'
import User from '../../../utils/userType'
import NotAllowed from '../../../components/NotAllowed'

interface EditCompanyProps
{
	company: Company
}

const EditCompany: React.FC<EditCompanyProps> = ({company}) =>
{
	const Router = useRouter()
	const [nomeFantasia, setNomeFantasia] = useState('')
	const [session, loading] = useSession()

	const {company: id} = Router.query
	if (!id) return <Loading />

	if (loading) return <Loading />
	
	const {user: tmpUser}:{user: any} = session
	const user: User = tmpUser

	if (user.role !== 'admin')
		return <NotAllowed />

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