import Head from 'next/head'
import {useRouter} from 'next/router'
import {useEffect, useState} from 'react'

import RequestForm from '../../components/forms/Request'
import api from '../../services/api'
import Request, { defaultRequest } from '../../models/request'
import { requestController } from '../../services/offline/controllers/request'

const EditRequest: React.FC = () =>
{
	const Router = useRouter()
	const {request: id} = Router.query

	const [request, setRequest] = useState<Request>(defaultRequest)

	useEffect(() =>
	{
		if (navigator.onLine)
			api.get(`requests-raw/${id}`)
				.then(({data}:{data: Request}) => setRequest(data))
		else
			requestController.rawOne(String(id))
				.then(data => setRequest(data))
	}, [])

	return (
		<div className='container'>
			<Head>
				<title>Editar pedido | Cruz Representações</title>
			</Head>

			<RequestForm
				method='put'
				id={String(id)}
				request={request}
			/>
		</div>
	)
}

export default EditRequest