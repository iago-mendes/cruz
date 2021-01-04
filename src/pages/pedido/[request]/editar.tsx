import Head from 'next/head'

import Header from '../../../components/Header'
import RequestForm from '../../../components/forms/Request'
import { useRouter } from 'next/router'

const EditRequest: React.FC = () =>
{
	const Router = useRouter()
	const {request: id} = Router.query

	return (
		<div className='container'>
			<Head>
				<title>Editar pedido | Cruz Representações</title>
			</Head>

			<Header display='Pedidos > Editar' />

			<main className='main'>
				<RequestForm
					method='put'
					id={String(id)}
					// request={}
				/>
			</main>
		</div>
	)
}

export default EditRequest