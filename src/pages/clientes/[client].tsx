import {useEffect, useState} from 'react'
import Head from 'next/head'
import {useRouter} from 'next/router'

import Header from '../../components/Header'
import ClientForm from '../../components/_forms/Client'
import Loading from '../../components/Loading'
import NotAllowed from '../../components/NotAllowed'
import api from '../../services/api'
import useAuth from '../../hooks/useAuth'
import Client, {defaultClient} from '../../models/client'

const EditClient: React.FC = () => {
	const Router = useRouter()
	const {client: id} = Router.query

	const {user, loading} = useAuth()
	const [nome_fantasia, setNomeFantasia] = useState('')
	const [client, setClient] = useState<Client>(defaultClient)

	useEffect(() => {
		api.get(`clients-raw/${id}`).then(res => setClient(res.data))
	}, [id])

	if (loading) return <Loading />
	if (user.role !== 'admin') return <NotAllowed />

	return (
		<div className="container">
			<Head>
				<title>{nome_fantasia} | Cruz Representações</title>
			</Head>

			<Header display={nome_fantasia} />

			<main className="main">
				<ClientForm
					method="put"
					nome_fantasia={nome_fantasia}
					setNomeFantasia={setNomeFantasia}
					id={String(id)}
					client={client}
				/>
			</main>
		</div>
	)
}

export default EditClient
