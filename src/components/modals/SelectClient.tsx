import { useEffect, useState } from 'react'
import { FiSearch, FiX } from 'react-icons/fi'
import { ClientListed } from '../../models/client'
import api from '../../services/api'
import Container from '../../styles/components/modals/SelectClient'
import { Image } from '../Image'
import Paginate from '../Paginate'
import ModalContainer from './Container'

interface SelectClientModalProps
{
	isOpen: boolean
	setIsOpen: (p: boolean) => void

	setClient: (p: string) => void
}

const SelectClientModal: React.FC<SelectClientModalProps> = ({isOpen, setIsOpen, setClient}) =>
{
	const [search, setSearch] = useState('')
	const [clients, setClients] = useState<ClientListed[]>([])
	const [page, setPage]	= useState(1)
	const [totalPages, setTotalPages] = useState(1)
	const [loading, setLoading] = useState(false)

	useEffect(() =>
	{
		setLoading(true)
		updateClients()
	}, [search, page])

	async function updateClients()
	{
		await api.get('clients', {params: {page, search}})
			.then(({data, headers}:{data: ClientListed[], headers: any}) =>
			{
				setClients(data)

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
				setClients([])

				setPage(1)
				setTotalPages(1)
			})
		
		setLoading(false)
	}

	function handleSelectClient(client: ClientListed)
	{
		const tmpClient = client.id
		setClient(tmpClient)

		setIsOpen(false)
	}

	return (
		<ModalContainer
			isOpen={isOpen}
			setIsOpen={setIsOpen}
		>
			<Container>
				<div className='search'>
					<FiSearch />
					<input
						type='text'
						value={search}
						onChange={e => setSearch(e.target.value)}
						placeholder='Pesquise por um cliente'
					/>
					<button className='clear' title='Limpar pesquisa' onClick={() => setSearch('')} >
						<FiX />
					</button>
				</div>

				<Paginate
					page={page}
					setPage={setPage}
					totalPages={totalPages}
					loading={loading}
					noResults={clients.length === 0 && !loading}
				>
					<div className='results'>
						{clients.map((client, index) => (
							<div
								className='client'
								key={index}
								onClick={() => handleSelectClient(client)}
							>
								<div className='img'>
									<Image src={client.imagem} alt={client.nome_fantasia} />
								</div>
								<div className='info'>
									<span className='highlight'>
										{client.nome_fantasia}
									</span>
									<span>
										{client.razao_social}
									</span>
								</div>
							</div>
						))}
					</div>
				</Paginate>
			</Container>
		</ModalContainer>
	)
}

export default SelectClientModal