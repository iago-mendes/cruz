import Head from 'next/head'
import {useRouter} from 'next/router'
import {useEffect, useState} from 'react'

import Header from '../../components/Header'
import RequestForm from '../../components/forms/Request'
import api from '../../services/api'
import Request from '../../models/request'

const EditRequest: React.FC = () =>
{
	const Router = useRouter()
	const {request: id} = Router.query

	const [request, setRequest] = useState<Request>(
	{
		_id: '',
		data: '',
		condicao: '',
		digitado_por: '',
		cliente: '',
		vendedor: '',
		representada: '',
		tipo: {venda: true, troca: false},
		status: {concluido: false,	enviado: false,	faturado: false},
		produtos: []
	})

	useEffect(() =>
	{
		api.get(`requests-raw/${id}`)
			.then(({data}:{data: Request}) => setRequest(data))
	}, [])

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
					request={request}
				/>
			</main>
		</div>
	)
}

export default EditRequest