import Head from 'next/head'
import {useRouter} from 'next/router'
import {useEffect, useState} from 'react'
import {FiEdit3, FiTrash} from 'react-icons/fi'

import {ClientListed, loadingClient} from '../../models/client'
import Header from '../../components/Header'
import api from '../../services/api'
import Add from '../../components/Add'
import Container from '../../styles/pages/clientes/index'
import useAuth from '../../hooks/useAuth'
import SheetModal from '../../components/_modals/Sheet'
import Paginate from '../../components/Paginate'
import confirmAlert from '../../utils/alerts/confirm'
import successAlert from '../../utils/alerts/success'
import errorAlert from '../../utils/alerts/error'
import {Image} from '../../components/Image'
import {clientController} from '../../services/offline/controllers/client'
import {SkeletonLoading} from '../../utils/skeletonLoading'

const Clients: React.FC = () => {
	const {push, query} = useRouter()
	const {user} = useAuth()

	const defaultClients: ClientListed[] = Array(10).fill(loadingClient)
	const [clients, setClients] = useState<ClientListed[]>(defaultClients)
	const [page, setPage] = useState(1)
	const [totalPages, setTotalPages] = useState(1)
	const [loading, setLoading] = useState(false)
	const [search, setSearch] = useState('')

	useEffect(() => {
		if (page !== 1 || totalPages !== 1 || search !== '') setLoading(true)

		updateClients()
	}, [page, search])

	useEffect(() => {
		const {search, page} = query

		if (search) setSearch(String(search))
		else setSearch('')

		if (page && !Number.isNaN(Number(page))) setPage(Number(page))
		else setPage(1)
	}, [query])

	async function updateClients() {
		await clientController
			.list(search, page)
			.then(({clients, page: newPage, totalPages}) => {
				setClients(clients)

				if (Number.isNaN(newPage)) setPage(1)
				else if (newPage !== page) setPage(newPage)

				if (Number.isNaN(totalPages)) setTotalPages(1)
				else setTotalPages(totalPages)
			})
			.catch(error => {
				console.log('<< error >>', error)
				setClients([])

				setPage(1)
				setTotalPages(1)
			})

		setLoading(false)
	}

	async function handleDeleteClient(client: ClientListed) {
		confirmAlert(
			'Você tem certeza?',
			`Se você continuar, o cliente ${client.nome_fantasia} será deletado!`,
			() =>
				api
					.delete(`clients/${client.id}`)
					.then(() => {
						updateClients()
						successAlert('Cliente deletado com sucesso!')
					})
					.catch(error => {
						errorAlert(error.response.message.data)
					})
		)
	}

	return (
		<Container className="container">
			<Head>
				<title>Clientes | Cruz Representações</title>
			</Head>

			<Add route="/clientes/adicionar" hideFromSellers={false} />

			<Header
				display="Clientes"
				showSearch
				search={search}
				setSearch={search => push(`/clientes?search=${search}&page=${page}`)}
				searchPlaceholder="Nome, cidade ou e-mail"
			/>

			<SheetModal
				headerPath={'sheet/clients/header'}
				uploadPath={'sheet/clients'}
				sheetName="Clientes"
				fileName={'Clientes (Cruz Representações)'}
				callback={updateClients}
			/>

			<Paginate
				page={page}
				setPage={page => push(`/clientes?search=${search}&page=${page}`)}
				totalPages={totalPages}
				loading={loading}
				noResults={clients.length === 0 && !loading}
			>
				{clients.map((client, index) => {
					if (client.id === 'loading')
						return (
							<div className="client" key={index}>
								<div className="imgNames">
									<SkeletonLoading height="6.5rem" width="6.5rem" />
									<div className="names">
										<SkeletonLoading height="2rem" width="20rem" />
										<SkeletonLoading height="2rem" width="20rem" />
									</div>
								</div>
								<div className="statusActions">
									<SkeletonLoading height="3rem" width="25rem" />
								</div>
							</div>
						)
					else
						return (
							<div className="client" key={index}>
								<div className="imgNames">
									<Image src={client.imagem} alt={client.nome_fantasia} />
									<div className="names">
										<h1>{client.nome_fantasia}</h1>
										<h2>{client.razao_social}</h2>
									</div>
								</div>
								<div className="statusActions">
									<div className="status">
										<span
											style={{
												backgroundColor: client.status.ativo
													? '#16881a'
													: '#881616'
											}}
										>
											{client.status.ativo ? 'ativo' : 'inativo'}
										</span>
										<span
											style={{
												backgroundColor: client.status.aberto
													? '#16881a'
													: '#881616'
											}}
										>
											{client.status.aberto ? 'aberto' : 'fechado'}
										</span>
										<span
											style={{
												backgroundColor: client.status.nome_sujo
													? '#881616'
													: '#16881a'
											}}
										>
											{client.status.nome_sujo ? 'nome sujo' : 'nome limpo'}
										</span>
									</div>
									<div className="buttons">
										{user.role === 'admin' && (
											<>
												<button
													title="Editar"
													onClick={() => push(`/clientes/${client.id}`)}
												>
													<FiEdit3 />
												</button>
												<button
													title="Deletar"
													onClick={() => handleDeleteClient(client)}
												>
													<FiTrash />
												</button>
											</>
										)}
									</div>
								</div>
							</div>
						)
				})}
			</Paginate>
		</Container>
	)
}

export default Clients
