import Head from 'next/head'

import Header from '../../components/Header'
import RequestForm from '../../components/forms/Request'

const AddRequest: React.FC = () =>
{
	return (
		<div className='container'>
			<Head>
				<title>Novo pedido | Cruz Representações</title>
			</Head>

			<Header display='Novo pedido' />

			<main className='main'>
				<RequestForm
					method='post'
				/>
			</main>
		</div>
	)
}

export default AddRequest