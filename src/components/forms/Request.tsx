import {useRouter} from 'next/router'
import Select from 'react-select'
import {useEffect, useState} from 'react'
import Switch from 'react-switch'
import {FiEdit3, FiTrash, FiPlus} from 'react-icons/fi'

import freteOptions from '../../../db/options/frete.json'

import Container from '../../styles/components/forms/global'
import Products from '../../styles/components/forms/RequestProducts'
import {selectStyles} from '../../styles/global'
import useUser from '../../hooks/useUser'
import RawProduct, {defaultProduct as defaultRawProduct} from '../../models/product'
import formatImage from '../../utils/formatImage'
import SelectProductModal, {Product, Selected, defaultSelected} from '../modals/SelectProduct'
import {SelectOption} from '../../utils/types'
import getDate from '../../utils/getDate'
import Request from '../../models/request'
import { CompanyCondition } from '../../models/company'
import FormButtons from '../FormButtons'
import warningAlert from '../../utils/alerts/warning'
import SelectClientModal from '../modals/SelectClient'
import { getRawCompanies, getRawCompany } from '../../services/requests/company'
import { getRawSellers } from '../../services/requests/seller'
import { getRawClient } from '../../services/requests/client'
import { createRequest, updateRequest } from '../../services/requests/request'

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

interface RawProductsList
{
	[companyId: string]: RawProduct[]
}

interface RequestFormProps
{
	method: string
	
	id?: string
	request?: Request
}

const RequestForm: React.FC<RequestFormProps> = ({method, id, request}) => 
{
	const {back} = useRouter()
	const {user, loading} = useUser()

	const [cliente, setCliente] = useState('')
	const [vendedor, setVendedor] = useState('')
	const [representada, setRepresentada] = useState('')
	const [produtos, setProdutos] = useState<Product[]>([])
	const [data, setData] = useState(getDate())
	const [condicao, setCondicao] = useState('')
	const [frete, setFrete] = useState(freteOptions[0].value)
	const [contato, setContato] = useState({nome: '', telefone: ''})
	const [digitado_por, setDigitadoPor] = useState('')
	const [tipo, setTipo] = useState<Type>({venda: true, troca: false})
	const [status, setStatus] = useState<Status>({concluido: false,	enviado: false,	faturado: false})

	const [sellerOptions, setSellerOptions] = useState<SelectOption[]>([])
	const [companyOptions, setCompanyOptions] = useState<SelectOption[]>([])
	const [conditionOptions, setConditionOptions] = useState<CompanyCondition[]>([])

	const [rawProductsList, setRawProductsList] = useState<RawProductsList>({})
	const [clientCompanyTableId, setClientCompanyTableId] = useState('')

	const [isModalOpen, setIsModalOpen] = useState(false)
	const [selected, setSelected] = useState<Selected>(defaultSelected)
	const [isSelectClientModalOpen, setIsSelectClientModalOpen] = useState(false)

	const [clientData, setClientData] = useState('')

	const conditionSelectOptions = conditionOptions
		// .filter(option => option.precoMin <= calcTotal())
		.sort((a,b) => a.precoMin < b.precoMin ? -1 : 1)
		.map(option => ({label: option.nome, value: option.nome}))
	
	useEffect(() =>
	{
		async function getSellers()
		{
			const sellers = await getRawSellers()
			const tmpSellerOptions: SelectOption[] = sellers.map(seller => (
				{
					label: seller.nome,
					value: seller._id
				}))
			
			setSellerOptions(tmpSellerOptions)
		}

		async function getCompanies()
		{
			const companies = await getRawCompanies()
			const tmpCompanyOptions: SelectOption[] = companies.map(company => (
				{
					label: company.nome_fantasia,
					value: company._id
				}))
			
			setCompanyOptions(tmpCompanyOptions)
		}

		async function getRawProductsList()
		{
			let tmpRawProductsList: RawProductsList = {}
			
			const companies = await getRawCompanies()
			companies.map(company =>
			{
				tmpRawProductsList[company._id] = company.produtos
			})

			setRawProductsList(tmpRawProductsList)
		}

		getSellers()
		getCompanies()
		getRawProductsList()
	}, [])

	useEffect(() =>
	{
		if (!loading)
			setVendedor(user.id)
	}, [loading, user])

	useEffect(() =>
	{
		async function updateTable()
		{
			if (cliente !== '' && representada !== '')
			{
				const client = await getRawClient(cliente)

				const clientCompany = client.representadas.find(({id}) => id === representada)
				if (clientCompany)
					setClientCompanyTableId(clientCompany.tabela)
			}
		}
		
		updateTable()
	}, [cliente, representada])

	useEffect(() =>
	{
		if (request)
		{
			setCliente(request.cliente)
			setVendedor(request.vendedor)
			setRepresentada(request.representada)
			setProdutos(request.produtos)
			setData(request.data)
			setCondicao(request.condicao)
			setFrete(request.frete)
			setContato(request.contato)
			setDigitadoPor(request.digitado_por)
			setTipo(request.tipo)
			setStatus(request.status)
		}
	}, [request])

	async function handleSelectClient(id: string)
	{
		setCliente(id)
		setProdutos([])

		let tmpSelected = {...selected}
		tmpSelected.clientId = id
		setSelected(tmpSelected)

		const client = await getRawClient(id)
		const tmpClientData = `${client.nome_fantasia} | ${client.razao_social}`
		setClientData(tmpClientData)
	}

	function handleSelectSeller(e: SelectOption)
	{
		setVendedor(e.value)
	}

	async function handleSelectCompany(e: SelectOption)
	{
		const companyId = e.value

		setRepresentada(companyId)
		setProdutos([])

		let tmpSelected = {...selected}
		tmpSelected.companyId = companyId
		setSelected(tmpSelected)

		const company = await getRawCompany(companyId)
		setConditionOptions(company.condicoes)
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
		if (representada === '')
			return warningAlert('Você precisa selecionar uma representada!')

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

		if (representada !== '')
		{
			produtos.map(product =>
			{
				const rawProduct = rawProductsList[representada].find(({_id}) => _id === product.id)

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

	async function handleSubmit()
	{
		const apiData =
		{
			cliente,
			vendedor,
			representada,
			produtos,
			data,
			condicao,
			frete,
			contato,
			digitado_por,
			tipo,
			status
		}

		if (method === 'post')
			await createRequest(apiData, back)
		else if (method === 'put')
			await updateRequest(id, apiData, back)
	}

	return (
		<Container onSubmit={e => e.preventDefault()}>
			<SelectProductModal
				isOpen={isModalOpen}
				setIsOpen={setIsModalOpen}

				selected={selected}
				setSelected={setSelected}

				products={produtos}
				setProducts={setProdutos}
			/>

			<SelectClientModal
				isOpen={isSelectClientModalOpen}
				setIsOpen={setIsSelectClientModalOpen}

				setClient={handleSelectClient}
			/>

			{/* cliente */}
			<div className='field'>
				<label htmlFor='cliente'>Cliente</label>
				<span className='modalResult' >
					{clientData}
				</span>
				<button className='modal' onClick={() => setIsSelectClientModalOpen(true)} >
					{method === 'post' && (
						'Selecionar cliente'
					)}

					{method === 'put' && (
						'Mudar cliente'
					)}
				</button>
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
			
			<Products>
				<div className='tableContainer' >
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

						{representada !== '' && (
							<tbody>
								{produtos.map((produto, index) =>
									{
										const rawProduct: RawProduct = (produto.id !== '' && representada !== '')
											? rawProductsList[representada].find(({_id}) => _id === produto.id)
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
				</div>
				<button type='button' onClick={handleAddProduct} className='add' >
					<FiPlus size={20} />
					<span>Adicionar produto</span>
				</button>
				<div className='total'>
					<span>Total = {priceToString(calcTotal())}</span>
				</div>
			</Products>

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
				<Select
					value={conditionSelectOptions.find(option => option.label === condicao)}
					options={conditionSelectOptions}
					onChange={e => setCondicao(e.value)}
					styles={selectStyles}
					placeholder='Condição de pagamento'
					isSearchable={false}
				/>
			</div>
			{/* frete */}
			<div className='field'>
				<label htmlFor='frete'>Frete</label>
				<Select
					value={freteOptions.find(option => option.label === frete)}
					options={freteOptions}
					onChange={e => setFrete(e.value)}
					styles={selectStyles}
					placeholder='Escolha uma opção de frete'
					isSearchable={false}
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
				<div className='switchFields'>
					<div className='switchField'>
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
					<div className='switchField'>
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
				<div className='switchFields'>
					<div className='switchField'>
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
					<div className='switchField'>
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
					<div className='switchField'>
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
			
			<FormButtons
				handleCancel={back}
				handleSubmit={handleSubmit}
			/>
		</Container>
	)
}

export default RequestForm