import Head from 'next/head'

import RequestForm from '../../components/_forms/Request'

const AddRequest: React.FC = () => {
	return (
		<div className="container">
			<Head>
				<title>Novo pedido | Cruz Representações</title>
			</Head>

			<RequestForm method="post" />
		</div>
	)
}

export default AddRequest
