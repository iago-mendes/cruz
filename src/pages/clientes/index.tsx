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

interface ClientsProps
{
	clients: Client[]
}

const Clients: React.FC<ClientsProps> = ({clients: staticClients}) =>
{
	const Router = useRouter()
	const {user} = useUser()
	
	const [clients, setClients] = useState<Client[]>(staticClients)

	async function updateCompanies()
	{
		api.get('clients')
			.then(({data}:{data: Client[]}) =>
			{
				setClients(data)
			})
			.catch(error =>
			{
				console.log('[error]', error)
				setClients(staticClients)
			})
	}

	async function handleDeleteClient(client: Client)
	{
		const yes = confirm(`Deseja deletar o cliente ${client.nome_fantasia}?`)
		if (yes)
		{
			await api.delete(`clients/${client.id}`).then(() =>
			{
				updateCompanies()
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
				callback={updateCompanies}
			/>

			<main className='main'>
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
			</main>

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