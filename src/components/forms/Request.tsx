import {useRouter} from 'next/router'
import Select from 'react-select'
import {FormEvent, useEffect, useState} from 'react'
import Switch from 'react-switch'

import Container from '../../styles/components/forms/Request'
import {selectStyles} from '../../styles/global'
import api from '../../services/api'
import {ListedClient} from './Client'
import {ListedSeller, Seller} from './Seller'
import {RawCompany } from './Company'
import useUser from '../../hooks/useUser'

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

interface Product
{
	_id?: string
	id: string
	quantidade: number
	preco: number
}

export interface Request
{
	_id: string
	data: string
	condicao: string
	digitado_por: string
	cliente: string
	vendedor: string
	representada: string
	linha: string
	tipo: Type
	status: Status
	produtos: Product[]
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

interface SelectOption
{
	value: string
	label: string
}

interface LineSelectOptions
{
	[key: string]: SelectOption[]
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
	const [data, setData] = useState('')
	const [condicao, setCondicao] = useState('')
	const [digitado_por, setDigitadoPor] = useState('')
	const [tipo, setTipo] = useState<Type>({venda: true, troca: false})
	const [status, setStatus] = useState<Status>({concluido: false,	enviado: false,	faturado: false})

	const [clientOptions, setClientOptions] = useState<SelectOption[]>([])
	const [sellerOptions, setSellerOptions] = useState<SelectOption[]>([])
	const [companyOptions, setCompanyOptions] = useState<SelectOption[]>([])
	const [lineOptions, setLineOptions] = useState<LineSelectOptions>({})

	useEffect(() =>
	{
		getOptions()
		if (!loading)
			setVendedor(user.id)
	}, [loading, user])

	async function getOptions()
	{
		await api.get('clients').then(({data: clients}:{data: ListedClient[]}) =>
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

			await api.get('companies-all').then(({data: companies}:{data: RawCompany[]}) =>
			{
				let tmpCompanies: SelectOption[] = []
				let tmpLines: LineSelectOptions = {}

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
					}
				})
				
				setCompanyOptions(tmpCompanies)
				setLineOptions(tmpLines)
			})
		}
	}

	function handleCompanyChange(e: SelectOption)
	{
		setRepresentada(e.value)
		setLinha('')
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

	async function handleSubmit(e: FormEvent)
	{
		e.preventDefault()

		const data = new FormData()

		// if (imagem) data.append('imagem', imagem)
		// data.append('nome', nome)
		// data.append('telefones', JSON.stringify(telefones))
		// data.append('email', email)
		// data.append('senha', senha)
		// data.append('funcao', funcao)
		// data.append('admin', String(admin))
		// data.append('representadas', JSON.stringify(representadas))

		// if (method === 'post')
		// {
		// 	await api.post('sellers', data)
		// 	.then(() =>
		// 	{
		// 		alert('Vendedor criado com sucesso!')
		// 		Router.back()
		// 	})
		// 	.catch(err =>
		// 	{
		// 		console.error(err)
		// 		alert('Algo errado aconteceu!')
		// 	})
		// }
		// else if (method === 'put')
		// {
		// 	await api.put(`sellers/${id}`, data)
		// 	.then(() =>
		// 	{
		// 		alert('Vendedor atualizado com sucesso!')
		// 		Router.back()
		// 	})
		// 	.catch(err =>
		// 	{
		// 		console.error(err)
		// 		alert('Algo errado aconteceu!')
		// 	})
		// }
	}

	return (
		<Container onSubmit={handleSubmit}>
			{/* cliente */}
			<div className='field'>
				<label htmlFor='cliente'>Cliente</label>
				<Select
					name='cliente'
					id='cliente'
					value={clientOptions.find(option => option.value === cliente)}
					onChange={e => setCliente(e.value)}
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
					onChange={e => setVendedor(e.value)}
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
					onChange={handleCompanyChange}
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
					onChange={e => setLinha(e.value)}
					options={(representada !== '' && lineOptions[representada]) ? lineOptions[representada] : []}
					isDisabled={representada === ''}
					styles={selectStyles}
					placeholder={representada !== '' ? 'Selecione a linha' : 'Selecione a representada'}
				/>
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