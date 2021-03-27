import {useRouter} from 'next/router'
import Select from 'react-select'
import {FormEvent, useEffect, useState} from 'react'
import Switch from 'react-switch'
import {FiEdit3, FiTrash, FiPlus} from 'react-icons/fi'

import Container from '../../styles/components/forms/Request'
import {selectStyles} from '../../styles/global'
import api from '../../services/api'
import {ListedSeller, Seller} from './Seller'
import useUser from '../../hooks/useUser'
import RawProduct, {defaultProduct as defaultRawProduct} from '../../models/product'
import formatImage from '../../utils/formatImage'
import RequestProductModal, {Product, Selected, defaultSelected} from './RequestProductModal'
import {SelectOption} from '../../utils/types'
import getDate from '../../utils/getDate'
import RawClient, {ClientListed} from '../../models/client'

interface Type
{
	venda: boolean
	troca: boolean
}

interface Status
{
	concluido: boolean
	enviado: boolean
	faturado: boolean
}

export interface Request
{
	_id: string
	cliente: string
	vendedor: string
	representada: string
	linha: string
	produtos: Product[]
	data: string
	condicao: string
	peso?: number
	digitado_por: string
	tipo: Type
	status: Status
}

export interface ListedRequest
{
	id: string
	data: string
	cliente:
	{
		imagem: string
		nome_fantasia: string
		razao_social: string
	}
	vendedor:
	{
		imagem: string
		nome: string
	}
	representada:
	{
		imagem: string
		nome_fantasia: string
		razao_social: string
	}
	tipo: Type
	status: Status
	valorTotal: number
}

interface LineSelectOptions
{
	[key: string]: SelectOption[]
}

interface RawProductsList
{
	[companyId: string]:
	{
		[lineId: string]: RawProduct[]
	}
}

interface RequestFormProps
{
	method: string
	
	id?: string
	request?: Request
}

const RequestForm: React.FC<RequestFormProps> = ({method, id, request}) => 
{
	const Router = useRouter()
	const {user, loading} = useUser()

	const [cliente, setCliente] = useState('')
	const [vendedor, setVendedor] = useState('')
	const [representada, setRepresentada] = useState('')
	const [linha, setLinha] = useState('')
	const [produtos, setProdutos] = useState<Product[]>([])
	const [data, setData] = useState(getDate())
	const [condicao, setCondicao] = useState('')
	const [peso, setPeso] = useState(0)
	const [digitado_por, setDigitadoPor] = useState('')
	const [tipo, setTipo] = useState<Type>({venda: true, troca: false})
	const [status, setStatus] = useState<Status>({concluido: false,	enviado: false,	faturado: false})

	const [clientOptions, setClientOptions] = useState<SelectOption[]>([])
	const [sellerOptions, setSellerOptions] = useState<SelectOption[]>([])
	const [companyOptions, setCompanyOptions] = useState<SelectOption[]>([])
	const [lineOptions, setLineOptions] = useState<LineSelectOptions>({})

	const [rawProductsList, setRawProductsList] = useState<RawProductsList>({})
	const [clientCompanyTableId, setClientCompanyTableId] = useState('')

	const [isModalOpen, setIsModalOpen] = useState(false)
	const [selected, setSelected] = useState<Selected>(defaultSelected)

	useEffect(() =>
	{
		getRawProductsList()
	}, [])

	useEffect(() =>
	{
		async function getOptions()
		{
			await api.get('clients').then(({data: clients}:{data: ClientListed[]}) =>
			{
				let tmpOptions: SelectOption[] = []

				clients.map(client => tmpOptions.push(
				{
					label: `${client.nome_fantasia} (${client.razao_social})`,
					value: client.id
				}))

				setClientOptions(tmpOptions)
			})

			await api.get('sellers').then(({data: sellers}:{data: ListedSeller[]}) =>
			{
				let tmpOptions: SelectOption[] = []

				sellers.map(seller => tmpOptions.push(
				{
					label: seller.nome,
					value: seller.id
				}))

				setSellerOptions(tmpOptions)
			})

			if (!loading && user.id !== 'not-logged')
			{
				let sellerCompanies: string[] = []

				await api.get(`sellers-raw/${user.id}`).then(({data: seller}:{data: Seller}) =>
				{
					sellerCompanies = seller.representadas.map(company => company.id)
				})

				await api.get('companies/raw').then(({data: companies}) =>
				{
					let tmpCompanies: SelectOption[] = []
					let tmpLines: LineSelectOptions = {}
					let tmpRawProductsList: RawProductsList = {}

					companies.map(company =>
					{
						if (sellerCompanies.includes(company._id))
						{
							tmpCompanies.push(
							{
								label: company.nome_fantasia,
								value: company._id
							})

							tmpLines[company._id] = company.linhas.map(line => (
							{
								label: line.nome,
								value: line._id
							}))

							tmpRawProductsList[company._id] = {}
							company.linhas.map(line =>
							{
								tmpRawProductsList[company._id][line._id] = line.produtos
							})
						}
					})
					
					setCompanyOptions(tmpCompanies)
					setLineOptions(tmpLines)
					setRawProductsList(tmpRawProductsList)
				})
			}
		}

		getOptions()
		if (!loading)
			setVendedor(user.id)
	}, [loading, user])

	useEffect(() =>
	{
		if (cliente !== '' && representada !== '')
			api.get(`/clients-raw/${cliente}`).then(({data: client}:{data: RawClient}) =>
			{
				const clientCompany = client.representadas.find(({id}) => id === representada)
				if (clientCompany)
					setClientCompanyTableId(clientCompany.tabela)
			})
	}, [cliente, representada])

	useEffect(() =>
	{
		getRawProductsList()

		if (request)
		{
			setCliente(request.cliente)
			setVendedor(request.vendedor)
			setRepresentada(request.representada)
			setLinha(request.linha)
			setProdutos(request.produtos)
			setData(request.data)
			setCondicao(request.condicao)
			if (request.peso)
				setPeso(request.peso)
			setDigitadoPor(request.digitado_por)
			setTipo(request.tipo)
			setStatus(request.status)
		}
	}, [request])

	function getRawProductsList()
	{
		api.get('companies/raw').then(({data: companies}) =>
		{
			let tmpRawProductsList: RawProductsList = {}

			companies.map(company =>
			{
				tmpRawProductsList[company._id] = {}
				company.linhas.map(line =>
				{
					tmpRawProductsList[company._id][line._id] = line.produtos
				})
			})
			
			setRawProductsList(tmpRawProductsList)
		})
	}

	function handleSelectClient(e: SelectOption)
	{
		setCliente(e.value)
		setProdutos([])

		let tmpSelected = {...selected}
		tmpSelected.clientId = e.value
		setSelected(tmpSelected)
	}

	function handleSelectSeller(e: SelectOption)
	{
		setVendedor(e.value)
		setProdutos([])
	}

	function handleSelectCompany(e: SelectOption)
	{
		setRepresentada(e.value)
		setLinha('')
		setProdutos([])

		let tmpSelected = {...selected}
		tmpSelected.companyId = e.value
		setSelected(tmpSelected)
	}

	function handleSelectLine(e: SelectOption)
	{
		setLinha(e.value)
		setProdutos([])

		let tmpSelected = {...selected}
		tmpSelected.lineId = e.value
		setSelected(tmpSelected)
	}

	function handleTypeChange(e: boolean, field: string)
	{
		let tmp = {...tipo}

		if (field === 'venda')
		{
			tmp.venda = e
			tmp.troca = !e
		}
		else if (field === 'troca')
		{
			tmp.troca = e
			tmp.venda = !e
		}

		setTipo(tmp)
	}

	function handleStatusChange(e: boolean, field: string)
	{
		let tmp = {...status}

		if (field === 'concluido')
			tmp.concluido = e
		if (field === 'enviado')
			tmp.enviado = e
		if (field === 'faturado')
			tmp.faturado = e

		setStatus(tmp)
	}

	function formatNumber(n: number)
	{
		return n.toFixed(2).replace('.', ',')
	}

	function handleAddProduct()
	{
		if (linha === '')
			return alert('Selecione a linha')

		let tmpSelected = {...selected}
		tmpSelected.product = defaultSelected.product
		setSelected(tmpSelected)

		setIsModalOpen(true)
	}

	function handleEditProduct(product: Product)
	{
		let tmpSelected = {...selected}
		tmpSelected.product = product
		setSelected(tmpSelected)

		setIsModalOpen(true)
	}

	function handleRemoveProduct(index: number)
	{
		let tmpProdutos = [...produtos]

		tmpProdutos.splice(index, 1)

		setProdutos(tmpProdutos)
	}

	function calcSubtotal(quantity: number, price: number, st: number, ipi: number)
	{
		let subtotal = quantity * price
		subtotal += subtotal * st / 100
		subtotal += subtotal * ipi / 100

		return subtotal
	}

	function calcTotal()
	{
		let total = 0

		if (representada !== '' && linha !== '')
		{
			produtos.map(product =>
			{
				const rawProduct = rawProductsList[representada][linha].find(({_id}) => _id === product.id)

				if (rawProduct)
				{
					const subtotal = calcSubtotal(product.quantidade, product.preco, rawProduct.st, rawProduct.ipi)
					total += subtotal
				}
			})
		}

		return total
	}

	function priceToString(p: number)
	{
		return 'R$ ' + p.toFixed(2).replace('.', ',')
	}

	function getTablePrice(product: RawProduct)
	{
		const table =	product.tabelas.find(({id}) => id === clientCompanyTableId)

		if (table)
			return table.preco
		else
			return 0
	}

	async function handleSubmit(e: FormEvent)
	{
		e.preventDefault()

		const apiData =
		{
			data,
			condicao,
			digitado_por,
			cliente,
			vendedor,
			representada,
			linha,
			peso,
			tipo,
			status,
			produtos
		}

		if (method === 'post')
		{
			await api.post('requests', apiData)
			.then(() =>
			{
				alert('Pedido criado com sucesso!')
				Router.back()
			})
			.catch(err =>
			{
				console.error(err)
				alert('Algo errado aconteceu!')
			})
		}
		else if (method === 'put')
		{
			await api.put(`requests/${id}`, apiData)
			.then(() =>
			{
				alert('Pedido atualizado com sucesso!')
				Router.back()
			})
			.catch(err =>
			{
				console.error(err)
				alert('Algo errado aconteceu!')
			})
		}
	}

	return (
		<Container onSubmit={handleSubmit}>
			<RequestProductModal
				isOpen={isModalOpen}
				setIsOpen={setIsModalOpen}
				selected={selected}
				setSelected={setSelected}
				products={produtos}
				setProducts={setProdutos}
			/>

			{/* cliente */}
			<div className='field'>
				<label htmlFor='cliente'>Cliente</label>
				<Select
					name='cliente'
					id='cliente'
					value={clientOptions.find(option => option.value === cliente)}
					onChange={handleSelectClient}
					options={clientOptions}
					styles={selectStyles}
					placeholder='Selecione o cliente'
				/>
			</div>
			{/* vendedor */}
			<div className='field'>
				<label htmlFor='vendedor'>Vendedor</label>
				<Select
					name='vendedor'
					id='vendedor'
					value={sellerOptions.find(option => option.value === vendedor)}
					onChange={handleSelectSeller}
					options={sellerOptions}
					styles={selectStyles}
					placeholder='Selecione o vendedor'
				/>
			</div>
			{/* representada */}
			<div className='field'>
				<label htmlFor='representada'>Representada</label>
				<Select
					name='representada'
					id='representada'
					value={companyOptions.find(option => option.value === representada)}
					onChange={handleSelectCompany}
					options={companyOptions}
					styles={selectStyles}
					placeholder='Selecione a representada'
				/>
			</div>
			{/* linha */}
			<div className='field'>
				<label htmlFor='linha'>Linha</label>
				<Select
					name='linha'
					value=
					{
						(representada !== '' && lineOptions[representada]) &&
							lineOptions[representada].find(option => option.value === linha)
					}
					onChange={handleSelectLine}
					options={(representada !== '' && lineOptions[representada]) ? lineOptions[representada] : []}
					isDisabled={representada === ''}
					styles={selectStyles}
					placeholder={representada !== '' ? 'Selecione a linha' : 'Selecione a representada'}
				/>
			</div>
			{/* produtos */}
			<div className='products'>
				<table>
					<thead>
						<tr>
							<th>Ações</th>
							<th>Imagem</th>
							<th>Nome</th>
							<th>Unidade</th>
							<th>Código</th>
							<th>St</th>
							<th>Ipi</th>
							<th>Quantidade</th>
							<th>Preço de tabela</th>
							<th>Preço líquido</th>
							<th>Subtotal (com taxas)</th>
						</tr>
					</thead>

					{(representada !== '' && linha !== '') && (
						<tbody>
							{produtos.map((produto, index) =>
								{
									const rawProduct: RawProduct = (produto.id !== '' && representada !== '' && linha !== '')
										? rawProductsList[representada][linha].find(({_id}) => _id === produto.id)
										: defaultRawProduct

									const tablePrice = produto.id !== ''
										? getTablePrice(rawProduct)
										: 0

									return (
										<tr key={index} >
											<td>
												<div className='actions'>
													<button
														title='Editar'
														onClick={() => handleEditProduct(produto)}>
														<FiEdit3 size={15} />
													</button>
													<button title='Remover' onClick={() => handleRemoveProduct(index)}>
														<FiTrash size={15} />
													</button>
												</div>
											</td>
											<td className='img' >
												<img src={formatImage(rawProduct.imagem)} alt={rawProduct.nome} />
											</td>
											<td>{rawProduct.nome}</td>
											<td>{rawProduct.unidade}</td>
											<td>{rawProduct.codigo}</td>
											<td>{formatNumber(rawProduct.st)} %</td>
											<td>{formatNumber(rawProduct.ipi)} %</td>
											<td>{produto.quantidade}</td>
											<td>{priceToString(tablePrice)}</td>
											<td>{priceToString(produto.preco)}</td>
											<td>
												{priceToString(
													calcSubtotal(produto.quantidade, produto.preco, rawProduct.st, rawProduct.ipi)
												)}
											</td>
										</tr>
									)})}
						</tbody>
					)}
				</table>
				<button type='button' onClick={handleAddProduct} className='add' >
					<FiPlus size={20} />
				</button>
				<div className="total">
					<span>Total = {priceToString(calcTotal())}</span>
				</div>
			</div>
			{/* data */}
			<div className='field'>
				<label htmlFor='data'>Data</label>
				<input
					type='date'
					name='data'
					id='data'
					value={data}
					onChange={e => setData(e.target.value)}
				/>
			</div>
			{/* condicao */}
			<div className='field'>
				<label htmlFor='condicao'>Condição</label>
				<input
					type='text'
					name='condicao'
					id='condicao'
					value={condicao}
					onChange={e => setCondicao(e.target.value)}
				/>
			</div>
			{/* peso */}
			<div className='field'>
				<label htmlFor='peso'>Peso (kg)</label>
				<input
					type='number'
					name='peso'
					id='peso'
					value={peso}
					onChange={e => setPeso(Number(e.target.value))}
				/>
			</div>
			{/* digitado_por */}
			<div className='field'>
				<label htmlFor='digitado_por'>Digitado por</label>
				<input
					type='text'
					name='digitado_por'
					id='digitado_por'
					value={digitado_por}
					onChange={e => setDigitadoPor(e.target.value)}
				/>
			</div>
			{/* tipo */}
			<div className='field'>
				<label htmlFor='tipo'>Tipo</label>
				<div className='toggle'>
					<div className='toggleField'>
						<span>venda</span>
						<Switch
							name='venda'
							id='venda'
							checked={tipo.venda}
							onChange={e => handleTypeChange(e, 'venda')}
							onHandleColor='#d8d8d8'
							offHandleColor='#d8d8d8'
						/>
					</div>
					<div className='toggleField'>
						<span>troca</span>
						<Switch
							name='troca'
							id='troca'
							checked={tipo.troca}
							onChange={e => handleTypeChange(e, 'troca')}
							onHandleColor='#d8d8d8'
							offHandleColor='#d8d8d8'
						/>
					</div>
				</div>
			</div>
			{/* status */}
			<div className='field'>
				<label htmlFor='status'>status</label>
				<div className='toggle'>
					<div className='toggleField'>
						<span>concluído</span>
						<Switch
							name='concluido'
							id='concluido'
							checked={status.concluido}
							onChange={e => handleStatusChange(e, 'concluido')}
							onHandleColor='#d8d8d8'
							offHandleColor='#d8d8d8'
						/>
					</div>
					<div className='toggleField'>
						<span>enviado</span>
						<Switch
							name='enviado'
							id='enviado'
							checked={status.enviado}
							onChange={e => handleStatusChange(e, 'enviado')}
							onHandleColor='#d8d8d8'
							offHandleColor='#d8d8d8'
						/>
					</div>
					<div className='toggleField'>
						<span>faturado</span>
						<Switch
							name='faturado'
							id='faturado'
							checked={status.faturado}
							onChange={e => handleStatusChange(e, 'faturado')}
							onHandleColor='#d8d8d8'
							offHandleColor='#d8d8d8'
						/>
					</div>
				</div>
			</div>
			
			<div className='buttons'>
				<button type='button' onClick={Router.back}>Cancelar</button>
				<button type='submit'>Confirmar</button>
			</div>
		</Container>
	)
}

export default RequestForm