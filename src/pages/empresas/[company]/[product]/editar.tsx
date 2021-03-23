import {useEffect, useState} from 'react'
import Head from 'next/head'
import {useRouter} from 'next/router'

import Header from '../../../../components/Header'
import ProductForm, {Product} from '../../../../components/forms/Product'
import Loading from '../../../../components/Loading'
import NotAllowed from '../../../../components/NotAllowed'
import api from '../../../../services/api'
import useUser from '../../../../hooks/useUser'

const AddCompany: React.FC = () =>
{
	const Router = useRouter()
	const {company, line, product: id} = Router.query

	const {user, loading} = useUser()
	const [nome, setNome] = useState('')
	const [product, setProduct] = useState<Product>(
	{
		_id: '',
		imagem: '',
		nome: '',
		codigo: 0,
		unidade: '',
		ipi: 0,
		st: 0,
		comissao: 0,
		tabelas: []
	})
	
	useEffect(() =>
	{
		api.get(`companies/${company}/lines/${line}/products-raw/${id}`)
			.then(res => setProduct(res.data))
	}, [company, line, id])

	if (loading) 
		return <Loading />
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
					companyId={String(company)}
					lineId={String(line)}
					nome={nome}
					setNome={setNome}
					id={String(id)}
					product={product}
				/>
			</main>
		</div>
	)
}

export default AddCompany