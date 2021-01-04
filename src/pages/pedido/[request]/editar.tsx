import Head from 'next/head'
import Header from '../../../components/Header'

const EditRequest: React.FC = () =>
{
	return (
		<div className='container'>
			<Head>
				<title>Editar pedido | Cruz Representações</title>
			</Head>

			<Header display={`Pedidos > 29/12/2020`} />
		</div>
	)
}

export default EditRequest