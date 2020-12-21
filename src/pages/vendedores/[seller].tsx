import {useEffect, useState} from 'react'
import Head from 'next/head'
import {useSession} from 'next-auth/client'
import {useRouter} from 'next/router'

import Header from '../../components/Header'
import ProductForm, {Seller} from '../../components/forms/Seller'
import Loading from '../../components/Loading'
import User from '../../utils/userType'
import NotAllowed from '../../components/NotAllowed'
import api from '../../services/api'

const EditSeller: React.FC = () =>
{
	const Router = useRouter()
	const {seller: id} = Router.query

	const [session, loading] = useSession()
	const [nome, setNome] = useState('')
	const [seller, setSeller] = useState<Seller>(
	{
		_id: '',
		nome: '',
		imagem: '',
		telefones: [],
		email: '',
		senha: '',
		funcao: '',
		admin: false,
		representadas: []
	})
	
	useEffect(() =>
	{
		api.get(`sellers-raw/${id}`)
			.then(res => setSeller(res.data))
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
				<title>{nome} | Cruz Representações</title>
			</Head>

			<Header display={nome} />

			<main className='main'>
				<ProductForm
					method='put'
					nome={nome}
					setNome={setNome}
					id={String(id)}
					seller={seller}
				/>
			</main>
		</div>
	)
}

export default EditSeller