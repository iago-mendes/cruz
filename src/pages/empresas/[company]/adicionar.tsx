import {useState} from 'react'
import Head from 'next/head'
import {useRouter} from 'next/router'

import ProductForm from '../../../components/_forms/Product'

const AddCompany: React.FC = () => {
	const {query} = useRouter()
	const companyId = String(query.company)

	const [nome, setNome] = useState('')

	return (
		<div className="container">
			<Head>
				<title>{nome} | Cruz Representações</title>
			</Head>

			<ProductForm
				method="post"
				companyId={companyId}
				nome={nome}
				setNome={setNome}
			/>
		</div>
	)
}

export default AddCompany
