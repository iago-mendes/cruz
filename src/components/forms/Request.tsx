import {useRouter} from 'next/router'
import Select from 'react-select'
import {FormEvent, useEffect, useState} from 'react'

import Container from '../../styles/components/forms/Request'
import {selectStyles} from "../../styles/global"
import api from '../../services/api'
import {ListedClient} from './Client'
import {ListedSeller} from './Seller'
import { ListedCompany } from './Company'

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

interface RequestFormProps
{
	method: string
	
	id?: string
	request?: Request
}

const RequestForm: React.FC<RequestFormProps> = ({method, id, request}) => 
{
	const Router = useRouter()

	const [cliente, setCliente] = useState('')
	const [vendedor, setVendedor] = useState('')
	const [representada, setRepresentada] = useState('')
	const [data, setData] = useState<Date>(null)
	const [linha, setLinha] = useState('')
	const [condicao, setCondicao] = useState('')
	const [digitado_por, setDigitadoPor] = useState('')
	const [tipo, setTipo] = useState<Type>(null)
	const [status, setStatus] = useState<Status>(null)
	const [produtos, setProdutos] = useState<Product[]>([])

	const [clientOptions, setClientOptions] = useState<SelectOption[]>([])
	const [sellerOptions, setSellerOptions] = useState<SelectOption[]>([])
	const [companyOptions, setCompanyOptions] = useState<SelectOption[]>([])

	useEffect(() =>
	{
		api.get('clients').then(({data: clients}:{data: ListedClient[]}) =>
		{
			let tmpOptions: SelectOption[] = []

			clients.map(client => tmpOptions.push(
			{
				label: `${client.nome_fantasia} (${client.razao_social})`,
				value: client.id
			}))

			setClientOptions(tmpOptions)
		})

		api.get('sellers').then(({data: sellers}:{data: ListedSeller[]}) =>
		{
			let tmpOptions: SelectOption[] = []

			sellers.map(seller => tmpOptions.push(
			{
				label: seller.nome,
				value: seller.id
			}))

			setSellerOptions(tmpOptions)
		})

		api.get('companies').then(({data: companies}:{data: ListedCompany[]}) =>
		{
			let tmpOptions: SelectOption[] = []

			companies.map(company => tmpOptions.push(
			{
				label: company.nome_fantasia,
				value: company.id
			}))
			
			setCompanyOptions(tmpOptions)
		})
	}, [])

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
					onChange={e => setRepresentada(e.value)}
					options={companyOptions}
					styles={selectStyles}
					placeholder='Selecione a representada'
				/>
			</div>
			<div className="buttons">
				<button type="button" onClick={Router.back}>Cancelar</button>
				<button type="submit">Confirmar</button>
			</div>
		</Container>
	)
}

export default RequestForm