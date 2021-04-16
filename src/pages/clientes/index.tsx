import {GetStaticProps} from 'next'
import Head from 'next/head'
import {useRouter} from 'next/router'
import {useEffect, useState} from 'react'
import useSWR from 'swr'
import {FiEdit3, FiTrash} from 'react-icons/fi'


import {ClientListed as Client} from '../../models/client'
import Header from '../../components/Header'
import Loading from '../../components/Loading'
import api from '../../services/api'
import Add from '../../components/Add'
import Container from '../../styles/pages/clientes/index'
import useUser from '../../hooks/useUser'
import SheetModal from '../../components/modals/Sheet'
import Paginate from '../../components/Paginate'

interface ClientsProps
{
	clients: Client[]
}

const Clients: React.FC<ClientsProps> = ({clients: staticClients}) =>
{
	const Router = useRouter()
	const {user} = useUser()
	
	const [clients, setClients] = useState<Client[]>(staticClients)
	const [page, setPage]	= useState(1)
	const [totalPages, setTotalPages] = useState(1)
	const [loading, setLoading] = useState(false)

	useEffect(() =>
	{
		updateClients()
	}, [])

	async function updateClients()
	{
		api.get('clients')
			.then(({data, headers}:{data: Client[], headers: any}) =>
			{
				setClients(data)

				console.log('[headers]', headers)
				console.log('[headers[page]]', headers['page'])
				console.log('[headers[total-pages]]', headers['total-pages'])

				const tmpPage = Number(headers['page'])
				if (Number.isNaN(tmpPage))
					setPage(1)
				else
					setPage(tmpPage)
					
				const tmpTotalPages = Number(headers['total-pages'])
				if (Number.isNaN(tmpTotalPages))
					setTotalPages(1)
				else
					setTotalPages(tmpTotalPages)
			})
			.catch(error =>
			{
				console.log('[error]', error)
				setClients(staticClients)

				setPage(1)
				setTotalPages(1)
			})
	}

	async function handleDeleteClient(client: Client)
	{
		const yes = confirm(`Deseja deletar o cliente ${client.nome_fantasia}?`)
		if (yes)
		{
			await api.delete(`clients/${client.id}`).then(() =>
			{
				updateClients()
				alert(`Cliente ${client.nome_fantasia} deletado com sucesso!`)
			})
		}
	}

	return (
		<Container className='container'>
			<Head>
				<title>Clientes | Cruz Representações</title>
			</Head>

			<Add route='/clientes/adicionar' />
			<Header display='Clientes' />

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
						<div className='left'>
							<img src={client.imagem} alt={client.nome_fantasia} />
							<div className='names'>
								<h1>{client.nome_fantasia}</h1>
								<h2>{client.razao_social}</h2>
							</div>
						</div>
						<div className='right'>
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
											<FiEdit3 size={25} />
										</button>
										<button title='Deletar' onClick={() => handleDeleteClient(client)} >
											<FiTrash size={25} />
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

export const getStaticProps: GetStaticProps = async ctx =>
{
	let clients: Client[] = []

	await api.get('clients').then(({data}) => clients = data)

	return {
		props: {clients},
		revalidate: 1
	}
}

export default Clients