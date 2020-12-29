import {useEffect, useState} from 'react'
import Head from 'next/head'
import {useSession} from 'next-auth/client'
import {useRouter} from 'next/router'

import Header from '../../components/Header'
import ClientForm, {Client} from '../../components/forms/Client'
import Loading from '../../components/Loading'
import User from '../../utils/userType'
import NotAllowed from '../../components/NotAllowed'
import api from '../../services/api'

const EditClient: React.FC = () =>
{
	const Router = useRouter()
	const {client: id} = Router.query

	const [session, loading] = useSession()
	const [nome_fantasia, setNomeFantasia] = useState('')
	const [client, setClient] = useState<Client>(
	{
		_id: '',
		razao_social: '',
		nome_fantasia: '',
		imagem: '',
		cnpj: '',
		insc_estadual: '',
		email: '',
		senha: '',
		vendedores: [],
		representadas: [],
		endereco: {},
		status: {ativo: true, aberto: true, nome_sujo: false}
	})
	
	useEffect(() =>
	{
		api.get(`clients-raw/${id}`)
			.then(res => setClient(res.data))
	}, [id])

	if (loading)
		return <Loading />
	
	const {user: tmpUser}:{user: any} = session
	const user: User = tmpUser

	if (user.role !== 'admin')
		return <NotAllowed />

	return (
		<div className='container'>
			<Head>
				<title>{nome_fantasia} | Cruz Representações</title>
			</Head>

			<Header display={nome_fantasia} />

			<main className='main'>
				<ClientForm
					method='put'
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