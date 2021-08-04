import {useState} from 'react'
import Head from 'next/head'

import Client from '../../components/_forms/Client'

const AddClient: React.FC = () => {
	const [nomeFantasia, setNomeFantasia] = useState('')

	return (
		<div className="container">
			<Head>
				<title>{nomeFantasia} | Cruz Representações</title>
			</Head>

			<Client
				method="post"
				nome_fantasia={nomeFantasia}
				setNomeFantasia={setNomeFantasia}
			/>
		</div>
	)
}

export default AddClient
