import {useEffect, useState} from 'react'
import Head from 'next/head'
import {useRouter} from 'next/router'

import Header from '../../components/Header'
import ProductForm, {Seller} from '../../components/_forms/Seller'
import Loading from '../../components/Loading'
import NotAllowed from '../../components/NotAllowed'
import useAuth from '../../hooks/useAuth'
import {sellerController} from '../../services/offline/controllers/seller'

const EditSeller: React.FC = () => {
	const Router = useRouter()
	const {seller: id} = Router.query

	const {user, loading} = useAuth()
	const [nome, setNome] = useState('')
	const [seller, setSeller] = useState<Seller>({
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

	useEffect(() => {
		sellerController.rawOne(String(id)).then(data => setSeller(data))
	}, [id])

	if (loading) return <Loading />
	if (user.role !== 'admin') return <NotAllowed />

	return (
		<div className="container">
			<Head>
				<title>{nome} | Cruz Representações</title>
			</Head>

			<Header display={nome} />

			<main className="main">
				<ProductForm
					method="put"
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
