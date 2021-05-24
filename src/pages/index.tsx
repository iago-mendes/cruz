import Head from 'next/head'
import {useRouter} from 'next/router'
import {useEffect, useState} from 'react'
import {FiEdit3, FiTrash} from 'react-icons/fi'
import {FaRegEye} from 'react-icons/fa'

import Container from '../styles/pages/index'
import {ListedRequest as Request} from '../components/forms/Request'
import Header from '../components/Header'
import Loading from '../components/Loading'
import api, {apiUrl} from '../services/api'
import Add from '../components/Add'
import formatDate from '../utils/formatDate'
import useAuth from '../hooks/useAuth'
import successAlert from '../utils/alerts/success'
import confirmAlert from '../utils/alerts/confirm'
import { Image } from '../components/Image'
import { requestController } from '../services/offline/controllers/request'

const Requests: React.FC = () =>
{
	const Router = useRouter()
	const {user, loading} = useAuth()
	
	const [requests, setRequests] = useState<Request[]>([])

	useEffect(() =>
	{
		updateRequests()
	}, [])

	async function updateRequests()
	{
		await requestController.list()
			.then(data =>
			{
				setRequests(data)
			})
			.catch(error =>
			{
				console.log('<< error >>', error)
				setRequests([])
			})
	}

	function handleDeleteRequest(request: Request)
	{
		confirmAlert(
			'Você tem certeza?',
			`Se você continuar, o pedido feito em ${formatDate(request.data)} será deletado!`,
			() => api.delete(`requests/${request.id}`)
				.then(() =>
				{
					updateRequests()
					successAlert('Pedido deletado com sucesso!')
				})
		)
	}

	if (loading)
		return <Loading />

	return (
		<Container className='container' isAdmin={user.role === 'admin'} >
			<Head>
				<title>Pedidos | Cruz Representações</title>
			</Head>

			<Add route='/pedidos/novo' />
			<Header display='Pedidos' />

			<main className='main'>
				{requests.map(request => (
					<div className='request' key={request.id}>
						<div className='header'>
							<div className='typeDate'>
								{request.tipo.venda && (
									<span style={{backgroundColor: '#357435'}}>
										venda
									</span>
								)}
								{request.tipo.troca && (
									<span style={{backgroundColor: '#2b2b68'}}>
										troca
									</span>
								)}
								<h2>{formatDate(request.data)}</h2>
							</div>
							<div className='status'>
								<span style={{backgroundColor: request.status.concluido ? '#16881a' : '#881616'}} >
									{request.status.concluido ? 'concluído' : 'em orçamento' }
								</span>
								<span style={{backgroundColor: request.status.enviado ? '#16881a' : '#881616'}} >
									{request.status.enviado ? 'enviado' : 'não enviado' }
								</span>
								<span style={{backgroundColor: request.status.faturado ? '#16881a' : '#881616'}} >
									{request.status.faturado ? 'faturado' : 'não faturado' }
								</span>
							</div>
							<div className='buttons'>
								<a
									title='Ver pedido'
									href={`${apiUrl}/pdf/requests/${request.id}`}
									target='_blank'
									rel="nonreferrer noreferrer"
								>
									<FaRegEye />
								</a>
								{user.role === 'admin' && (
									<>
										<button title='Editar' onClick={() => Router.push(`/pedidos/${request.id}`)}>
											<FiEdit3 />
										</button>
										<button
											title='Deletar'
											onClick={() => handleDeleteRequest(request)}
											className='delete'
										>
											<FiTrash />
										</button>
									</>
								)}
							</div>
						</div>
						<ul>
							<li>
								<div className='imgName'>
									<Image src={request.cliente.imagem} alt={request.cliente.nome_fantasia}/>
									<h1>{request.cliente.nome_fantasia}</h1>
								</div>
								<div className='description'>
									<h2>{request.cliente.razao_social}</h2>
								</div>
							</li>
							<li>
								<div className='imgName'>
									<Image src={request.representada.imagem} alt={request.representada.nome_fantasia}/>
									<h1>{request.representada.nome_fantasia}</h1>
								</div>
								<div className='description'>
									<h2>{request.representada.razao_social}</h2>
								</div>
							</li>
							<li>
								<div className='imgName'>
									<Image src={request.vendedor.imagem} alt={request.vendedor.nome}/>
									<h1>{request.vendedor.nome}</h1>
								</div>
							</li>
						</ul>
					</div>
				))}
			</main>

		</Container>
	)
}

export default Requests