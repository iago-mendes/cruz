import {useEffect, useState} from 'react'
import Head from 'next/head'
import {useRouter} from 'next/router'

import ClientForm from '../../components/_forms/Client'
import Client, {defaultClient} from '../../models/client'
import {clientController} from '../../services/offline/controllers/client'

const EditClient: React.FC = () => {
	const {query} = useRouter()
	const clientId = String(query.client)

	const [nome_fantasia, setNomeFantasia] = useState('')
	const [client, setClient] = useState<Client>(defaultClient)

	useEffect(() => {
		clientController.rawOne(clientId).then(setClient)
	}, [clientId])

	return (
		<div className="container">
			<Head>
				<title>{nome_fantasia} | Cruz Representações</title>
			</Head>

			<ClientForm
				method="put"
				nome_fantasia={nome_fantasia}
				setNomeFantasia={setNomeFantasia}
				id={clientId}
				client={client}
			/>
		</div>
	)
}

export default EditClient
