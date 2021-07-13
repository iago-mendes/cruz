import {useState} from 'react'
import Head from 'next/head'

import Header from '../../components/Header'
import CompanyForm from '../../components/forms/Company'
import Loading from '../../components/Loading'
import NotAllowed from '../../components/NotAllowed'
import useAuth from '../../hooks/useAuth'

const AddCompany: React.FC = () => {
	const {user, loading} = useAuth()
	const [nomeFantasia, setNomeFantasia] = useState('')

	if (loading) return <Loading />
	if (user.role !== 'admin') return <NotAllowed />

	return (
		<div className="container">
			<Head>
				<title>{nomeFantasia} | Cruz Representações</title>
			</Head>

			<Header display={nomeFantasia} />

			<main className="main">
				<CompanyForm
					method="post"
					nomeFantasia={nomeFantasia}
					setNomeFantasia={setNomeFantasia}
				/>
			</main>
		</div>
	)
}

export default AddCompany
