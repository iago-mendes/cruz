import Head from 'next/head'
import {useRouter} from 'next/router'
import {useEffect, useState} from 'react'
import {FiEdit3, FiTrash} from 'react-icons/fi'

import {ClientListed as Client} from '../../models/client'
import Header from '../../components/Header'
import api from '../../services/api'
import Add from '../../components/Add'
import Container from '../../styles/pages/clientes/index'
import useAuth from '../../hooks/useAuth'
import SheetModal from '../../components/modals/Sheet'
import Paginate from '../../components/Paginate'
import confirmAlert from '../../utils/alerts/confirm'
import successAlert from '../../utils/alerts/success'
import errorAlert from '../../utils/alerts/error'
import { Image } from '../../components/Image'
import { clientController } from '../../services/offline/controllers/client'

const Clients: React.FC = () =>
{
	const Router = useRouter()
	const {user} = useAuth()
	
	const [clients, setClients] = useState<Client[]>([])
	const [page, setPage]	= useState(1)
	const [totalPages, setTotalPages] = useState(1)
	const [loading, setLoading] = useState(false)
	const [search, setSearch] = useState('')

	useEffect(() =>
	{
		if (page !== 1 || totalPages !== 1 || search !== '')
			setLoading(true)

		updateClients()
	}, [page, search])

	async function updateClients()
	{
		await clientController.list(search, page)
			.then(({clients, page, totalPages}) =>
			{
				setClients(clients)

				if (Number.isNaN(page))
					setPage(1)
				else
					setPage(page)
					
				if (Number.isNaN(totalPages))
					setTotalPages(1)
				else
					setTotalPages(totalPages)
			})
			.catch(error =>
			{
				console.log('<< error >>', error)
				setClients([])

				setPage(1)
				setTotalPages(1)
			})
		
		setLoading(false)
	}

	async function handleDeleteClient(client: Client)
	{
		confirmAlert(
			'Você tem certeza?',
			`Se você continuar, o cliente ${client.nome_fantasia} será deletado!`,
			() => api.delete(`clients/${client.id}`)
				.then(() =>
				{
					updateClients()
					successAlert('Cliente deletado com sucesso!')
				})
				.catch(error =>
				{
					errorAlert(error.response.message.data)
				})
		)
	}

	return (
		<Container className='container'>
			<Head>
				<title>Clientes | Cruz Representações</title>
			</Head>

			<Add route='/clientes/adicionar' />
			<Header
				display='Clientes'

				showSearch
				search={search}
				setSearch={setSearch}
			/>

			<SheetModal
				headerPath={'sheet/clients/header'}
				uploadPath={'sheet/clients'}
				sheetName='Clientes'
				fileName={'Clientes (Cruz Representações)'}
				callback={updateClients}
			/>

			<Paginate
				page={page}
				setPage={setPage}
				totalPages={totalPages}
				loading={loading}
				noResults={clients.length === 0 && !loading}
			>
				{clients.map(client => (
					<div className='client' key={client.id} >
						<div className='imgNames'>
							<Image src={client.imagem} alt={client.nome_fantasia} />
							<div className='names'>
								<h1>{client.nome_fantasia}</h1>
								<h2>{client.razao_social}</h2>
							</div>
						</div>
						<div className='statusActions'>
							<div className='status'>
								<span style={{backgroundColor: client.status.ativo ? '#16881a' : '#881616'}} >
									{client.status.ativo ? 'ativo' : 'inativo' }
								</span>
								<span style={{backgroundColor: client.status.aberto ? '#16881a' : '#881616'}} >
									{client.status.aberto ? 'aberto' : 'fechado' }
								</span>
								<span style={{backgroundColor: client.status.nome_sujo ? '#881616' : '#16881a'}} >
									{client.status.nome_sujo ? 'nome sujo' : 'nome limpo' }
								</span>
							</div>
							<div className='buttons'>
								{user.role === 'admin' && (
									<>
										<button title='Editar' onClick={() => Router.push(`/clientes/${client.id}`)}>
											<FiEdit3 />
										</button>
										<button title='Deletar' onClick={() => handleDeleteClient(client)} >
											<FiTrash />
										</button>
									</>
								)}
							</div>
						</div>
					</div>
				))}
			</Paginate>
		</Container>
	)
}

export default Clients