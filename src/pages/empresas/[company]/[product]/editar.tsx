import {useEffect, useState} from 'react'
import Head from 'next/head'
import {useRouter} from 'next/router'

import Header from '../../../../components/Header'
import ProductForm from '../../../../components/forms/Product'
import Product, {defaultProduct} from '../../../../models/product'
import { productController } from '../../../../services/offline/controllers/product'

const EditProduct: React.FC = () =>
{
	const {query} = useRouter()
	const {company: companyId, product: productId} = query

	const [nome, setNome] = useState('')
	const [product, setProduct] = useState<Product>(defaultProduct)
	
	useEffect(() =>
	{
		productController.rawOne(String(companyId), String(productId))
			.then(data => setProduct(data))
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