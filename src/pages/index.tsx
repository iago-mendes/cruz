import Head from 'next/head'
import {useRouter} from 'next/router'
import {useEffect, useState} from 'react'
import {FiEdit3, FiTrash} from 'react-icons/fi'
import {FaRegEye} from 'react-icons/fa'

import Container from '../styles/pages/index'
import Header from '../components/Header'
import Add from '../components/Add'
import formatDate from '../utils/formatDate'
import useAuth from '../hooks/useAuth'
import {Image} from '../components/Image'
import {requestController} from '../services/offline/controllers/request'
import {RequestListed, loadingRequest} from '../models/request'
import {SkeletonLoading} from '../utils/skeletonLoading'
import Paginate from '../components/Paginate'
import LoadingModal from '../components/modals/Loading'
import {handleDeleteRequest} from '../utils/requests/handleDeleteRequest'
import {handleSeeRequestPDF} from '../utils/requests/handleSeeRequestPDF'

const Requests: React.FC = () => {
	const Router = useRouter()
	const {user} = useAuth()

	const defaultRequests: RequestListed[] = Array(3).fill(loadingRequest)
	const [requests, setRequests] = useState<RequestListed[]>(defaultRequests)

	const [page, setPage] = useState(1)
	const [totalPages, setTotalPages] = useState(1)
	const [loading, setLoading] = useState(false)

	const [isLoadingModalOpen, setIsLoadingModalOpen] = useState(false)

	useEffect(() => {
		updateRequests()
	}, [page])

	async function updateRequests() {
		if (!(page === 1 && totalPages === 1)) setLoading(true)

		await requestController
			.list()
			.then(({requests, page, totalPages}) => {
				setRequests(requests)

				if (Number.isNaN(page)) setPage(1)
				else setPage(page)

				if (Number.isNaN(totalPages)) setTotalPages(1)
				else setTotalPages(totalPages)
			})
			.catch(error => {
				console.log('<< error >>', error)
				setRequests([])

				setPage(1)
				setTotalPages(1)
			})

		setLoading(false)
	}

	return (
		<Container className="container">
			<Head>
				<title>Pedidos | Cruz Representações</title>
			</Head>

			<LoadingModal isOpen={isLoadingModalOpen} />

			<Add route="/pedidos/novo" hideFromSellers={false} />
			<Header display="Pedidos" />

			<Paginate
				page={page}
				setPage={setPage}
				totalPages={totalPages}
				loading={loading}
				noResults={requests.length === 0 && !loading}
			>
				{requests.map((request, index) => {
					if (request.id === 'loading')
						return (
							<div className="request" key={index}>
								<div className="header">
									<div className="typeDate">
										<SkeletonLoading height="2rem" width="15rem" />
									</div>
									<div className="status">
										<SkeletonLoading height="2rem" width="30rem" />
									</div>
									<div className="buttons">
										<SkeletonLoading height="2rem" width="10rem" />
									</div>
								</div>
								<ul>
									<li>
										<div className="imgName">
											<SkeletonLoading height="5rem" width="5rem" />
											<SkeletonLoading height="2.5rem" width="20rem" />
										</div>
										<div className="description">
											<SkeletonLoading height="2rem" width="20rem" />
										</div>
									</li>
									<li>
										<div className="imgName">
											<SkeletonLoading height="5rem" width="5rem" />
											<SkeletonLoading height="2.5rem" width="20rem" />
										</div>
										<div className="description">
											<SkeletonLoading height="2rem" width="20rem" />
										</div>
									</li>
									<li>
										<div className="imgName">
											<SkeletonLoading height="5rem" width="5rem" />
											<SkeletonLoading height="2.5rem" width="20rem" />
										</div>
									</li>
								</ul>
							</div>
						)
					else
						return (
							<div className="request" key={index}>
								<div className="header">
									<div className="typeDate">
										{request.tipo.venda && (
											<span style={{backgroundColor: '#357435'}}>venda</span>
										)}
										{request.tipo.troca && (
											<span style={{backgroundColor: '#2b2b68'}}>troca</span>
										)}
										<h2>{formatDate(request.data)}</h2>
									</div>
									<div className="status">
										<span
											style={{
												backgroundColor: request.status.concluido
													? '#16881a'
													: '#ff9933'
											}}
										>
											{request.status.concluido ? 'concluído' : 'em orçamento'}
										</span>
										<span
											style={{
												backgroundColor: request.status.enviado
													? '#16881a'
													: '#881616'
											}}
										>
											{request.status.enviado ? 'enviado' : 'não enviado'}
										</span>
										<span
											style={{
												backgroundColor: request.status.faturado
													? '#16881a'
													: '#881616'
											}}
										>
											{request.status.faturado ? 'faturado' : 'não faturado'}
										</span>
									</div>
									<div className="buttons">
										<button
											title="Ver pedido"
											onClick={() =>
												handleSeeRequestPDF(request.id, setIsLoadingModalOpen)
											}
										>
											<FaRegEye />
										</button>
										{user.role === 'admin' && (
											<>
												<button
													title="Editar"
													onClick={() => Router.push(`/pedidos/${request.id}`)}
												>
													<FiEdit3 />
												</button>
												<button
													title="Deletar"
													onClick={() =>
														handleDeleteRequest(
															request.id,
															request.data,
															updateRequests
														)
													}
													className="delete"
												>
													<FiTrash />
												</button>
											</>
										)}
									</div>
								</div>
								<ul>
									<li>
										<div className="imgName">
											<Image
												src={request.cliente.imagem}
												alt={request.cliente.nome_fantasia}
											/>
											<h1>{request.cliente.nome_fantasia}</h1>
										</div>
										<div className="description">
											<h2>{request.cliente.razao_social}</h2>
										</div>
									</li>
									<li>
										<div className="imgName">
											<Image
												src={request.representada.imagem}
												alt={request.representada.nome_fantasia}
											/>
											<h1>{request.representada.nome_fantasia}</h1>
										</div>
										<div className="description">
											<h2>{request.representada.razao_social}</h2>
										</div>
									</li>
									<li>
										<div className="imgName">
											<Image
												src={request.vendedor.imagem}
												alt={request.vendedor.nome}
											/>
											<h1>{request.vendedor.nome}</h1>
										</div>
									</li>
								</ul>
							</div>
						)
				})}
			</Paginate>
		</Container>
	)
}

export default Requests
