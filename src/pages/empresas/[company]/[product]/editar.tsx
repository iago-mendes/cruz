import {useEffect, useState} from 'react'
import Head from 'next/head'
import {useRouter} from 'next/router'

import ProductForm from '../../../../components/_forms/Product'
import Product, {defaultProduct} from '../../../../models/product'
import {productController} from '../../../../services/offline/controllers/product'

const EditProduct: React.FC = () => {
	const {query} = useRouter()
	const companyId = String(query.company)
	const productId = String(query.product)

	const [nome, setNome] = useState('')
	const [product, setProduct] = useState<Product>(defaultProduct)

	useEffect(() => {
		productController
			.rawOne(companyId, productId)
			.then(data => setProduct(data))
	}, [companyId, productId])

	return (
		<div className="container">
			<Head>
				<title>{nome} | Cruz Representações</title>
			</Head>

			<ProductForm
				method="put"
				companyId={companyId}
				nome={nome}
				setNome={setNome}
				id={productId}
				product={product}
			/>
		</div>
	)
}

export default EditProduct
