import {useState} from 'react'
import Head from 'next/head'

import Client from '../../components/forms/Client'
import Loading from '../../components/Loading'
import NotAllowed from '../../components/NotAllowed'
import Header from '../../components/Header'
import useAuth from '../../hooks/useAuth'

const AddClient: React.FC = () => {
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
				<Client
					method="post"
					nome_fantasia={nomeFantasia}
					setNomeFantasia={setNomeFantasia}
				/>
			</main>
		</div>
	)
}

export default AddClient
