import {useEffect, useState} from 'react'
import Head from 'next/head'
import {useRouter} from 'next/router'

import Header from '../../../../components/Header'
import ProductForm from '../../../../components/forms/Product'
import api from '../../../../services/api'
import Product, {defaultProduct} from '../../../../models/product'

const EditProduct: React.FC = () =>
{
	const {query} = useRouter()
	const {company: companyId, product: productId} = query

	const [nome, setNome] = useState('')
	const [product, setProduct] = useState<Product>(defaultProduct)
	
	useEffect(() =>
	{
		api.get(`companies/${companyId}/products/${productId}/raw`)
			.then(({data}:{data: Product}) =>
			{
				console.log('[data]', data)
				setProduct(data)
			})
	}, [companyId, productId])

	return (
		<div className='container'>
			<Head>
				<title>{nome} | Cruz Representações</title>
			</Head>

			<Header display={nome} />

			<main className='main'>
				<ProductForm
					method='put'
					companyId={String(companyId)}
					nome={nome}
					setNome={setNome}
					id={String(productId)}
					product={product}
				/>
			</main>
		</div>
	)
}

export default EditProduct