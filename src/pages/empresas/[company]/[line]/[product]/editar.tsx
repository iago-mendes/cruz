import {useEffect, useState} from 'react'
import Head from 'next/head'
import {useSession} from 'next-auth/client'
import {useRouter} from 'next/router'

import Container from '../../../../../styles/pages/empresas/[company]/[line]/adicionar'
import Header from '../../../../../components/CompanyHeader'
import ProductForm, {Product} from '../../../../../components/forms/Product'
import Loading from '../../../../../components/Loading'
import {User} from '../../../index'
import NotAllowed from '../../../../../components/NotAllowed'
import api from '../../../../../services/api'

const AddCompany: React.FC = () =>
{
	const Router = useRouter()
	const {company, line, product: id} = Router.query

	const [session, loading] = useSession()
	const [nome, setNome] = useState('')
	const [product, setProduct] = useState<Product>(
	{
		id: '',
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

	if (loading) return <Loading />
	
	const {user: tmpUser}:{user: any} = session
	const user: User = tmpUser

	if (user.role !== 'admin')
		return <NotAllowed />

	return (
		<Container className="container">
			<Head>
				<title>{nome} | Cruz Representações</title>
			</Head>

			<Header display={nome} />

			<ProductForm
				method='put'
				companyId={String(company)}
				lineId={String(line)}
				nome={nome}
				setNome={setNome}
				id={String(id)}
				product={product}
			/>
		</Container>
	)
}

export default AddCompany