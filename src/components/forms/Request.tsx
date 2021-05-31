import {useRouter} from 'next/router'
import Select from 'react-select'
import {useEffect, useState} from 'react'
import Switch from 'react-switch'

import freteOptions from '../../../db/options/frete.json'

import Container from '../../styles/components/forms/global'
import {selectStyles} from '../../styles/global'
import useAuth from '../../hooks/useAuth'
import RawProduct from '../../models/product'
import SelectProductsModal from '../modals/SelectProducts'
import {SelectOption} from '../../utils/types'
import getDate from '../../utils/getDate'
import Request, { defaultSelected, RequestProduct, Selected, Status, Type } from '../../models/request'
import { CompanyCondition } from '../../models/company'
import FormButtons from '../FormButtons'
import SelectClientModal from '../modals/SelectClient'
import api from '../../services/api'
import successAlert from '../../utils/alerts/success'
import { sellerController } from '../../services/offline/controllers/seller'
import { companyController } from '../../services/offline/controllers/company'
import { clientController } from '../../services/offline/controllers/client'
import { catchError } from '../../utils/catchError'
import RequestSummaryModal from '../modals/RequestSummary'

type RawProductsList =
{
	[companyId: string]: RawProduct[]
}

type RequestFormProps =
{
	method: string
	
	id?: string
	request?: Request
}

const RequestForm: React.FC<RequestFormProps> = ({method, id, request}) => 
{
	const {back} = useRouter()
	const {user, loading} = useAuth()

	const [cliente, setCliente] = useState('')
	const [vendedor, setVendedor] = useState('')
	const [representada, setRepresentada] = useState('')
	const [produtos, setProdutos] = useState<RequestProduct[]>([])
	const [data, setData] = useState(getDate(true))
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
	const [selected, setSelected] = useState<Selected>(defaultSelected)
	const [clientData, setClientData] = useState('')

	const [isSelectProductsModalOpen, setIsSelectProductsModalOpen] = useState(false)
	const [isSelectClientModalOpen, setIsSelectClientModalOpen] = useState(false)

	const conditionSelectOptions = conditionOptions
		// .filter(option => option.precoMin <= calcTotal())
		.sort((a,b) => a.precoMin < b.precoMin ? -1 : 1)
		.map(option => ({label: option.nome, value: option.nome}))
	
	useEffect(() =>
	{
		async function getSellers()
		{
			const sellers = await sellerController.raw()
			const tmpSellerOptions: SelectOption[] = sellers.map(seller => (
				{
					label: seller.nome,
					value: seller._id
				}))
			
			setSellerOptions(tmpSellerOptions)
		}

		async function getCompaniesAndRawProductsList()
		{
			const companies = await companyController.raw()
			let tmpRawProductsList: RawProductsList = {}

			const tmpCompanyOptions: SelectOption[] = companies.map(company =>
			{
				tmpRawProductsList[company._id] = company.produtos

				return (
					{
						label: company.nome_fantasia,
						value: company._id
					}
				)
			})
			
			setCompanyOptions(tmpCompanyOptions)
			setRawProductsList(tmpRawProductsList)
		}

		getSellers()
		getCompaniesAndRawProductsList()
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
				let tmpSelected = {...selected}
				const client = await clientController.rawOne(cliente)

				const clientCompany = client.representadas.find(({id}) => id === representada)
				if (clientCompany)
				{
					tmpSelected.clientCompanyTableId = clientCompany.tabela
					setSelected(tmpSelected)
				}
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

			clientController.rawOne(request.cliente)
				.then(client =>
				{
					const tmpClientData = `${client.nome_fantasia} | ${client.razao_social}`
					setClientData(tmpClientData)
				})

			companyController.rawOne(request.representada)
				.then(company =>
				{
					if (company)
						setConditionOptions(company.condicoes)
				})
		}
	}, [request])

	async function handleSelectClient(id: string)
	{
		setCliente(id)
		setProdutos([])

		let tmpSelected = {...selected}
		tmpSelected.clientId = id
		setSelected(tmpSelected)

		const client = await clientController.rawOne(id)
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

		const company = await companyController.rawOne(companyId)
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

	function handleSubmit()
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
		{
			api.post('requests', apiData)
				.then(() =>
				{
					successAlert('Pedido criado com sucesso!')
					back()
				})
				.catch(catchError)
		}
		else if (method === 'put')
		{
			api.put(`requests/${id}`, apiData)
				.then(() =>
				{
					successAlert('Pedido atualizado com sucesso!')
					back()
				})
				.catch(catchError)
		}
		
		if (!navigator.onLine)
			back()
	}

	return (
		<Container onSubmit={e => e.preventDefault()}>
			<SelectProductsModal
				isOpen={isSelectProductsModalOpen}
				setIsOpen={setIsSelectProductsModalOpen}

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

			<RequestSummaryModal
				companyId={representada}
				products={produtos}
				rawProductsList={rawProductsList}
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
			{/* produtos */}
			<div className='field'>
				<label htmlFor='produtos'>Produtos</label>
				<button className='modal' onClick={() => setIsSelectProductsModalOpen(true)} >
					Selecionar produtos
				</button>
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