import {useRouter} from "next/router"
import {ChangeEvent, FormEvent, useEffect, useState} from "react"
import Select, {OptionsType} from 'react-select'
import api from "../../services/api"
import Switch from 'react-switch'

import Container from '../../styles/components/forms/Client'
import {selectStyles} from "../../styles/global"
import Dropzone from "../Dropzone"
import {ListedSeller} from "./Seller"
import {Company} from "./Company"

interface ClientCompany
{
	_id?: string
	id: string
	tabela: string
}

interface Address
{
	rua?: string
	numero?: number
	complemento?: string
	bairro?: string
	cep?: number
	cidade?: string
	uf?: string
}

interface Status
{
	ativo: boolean
	aberto: boolean
	nome_sujo: boolean
}

export interface Client
{
	_id: string
	razao_social: string
	nome_fantasia: string
	imagem: string
	cnpj: string
	insc_estadual: string
	email: string
	senha: string
	vendedores: string[]
	representadas: ClientCompany[]
	endereco: Address
	status: Status
}

export interface ListedClient
{
	id: string
	razao_social: string
	nome_fantasia: string
	imagem: string
	status:
	{
		ativo: boolean
		aberto: boolean
		nome_sujo: boolean
	}
}

interface SelectOption
{
	value: string
	label: string
}

interface TableSelectOptions
{
	[key: string]: SelectOption[]
}

interface ClientFormProps
{
	method: string
	
	nome_fantasia: string
	setNomeFantasia: Function
	
	id?: string
	client?: Client
}

const ClientForm: React.FC<ClientFormProps> = ({method, nome_fantasia, setNomeFantasia, id, client}) =>
{
	const Router = useRouter()

	const [razao_social, setRazaoSocial] = useState('')
	const [imagem, setImagem] = useState<File>()
	const [cnpj, setCnpj] = useState('')
	const [insc_estadual, setInscEstadual] = useState('')
	const [email, setEmail] = useState('')
	const [senha, setSenha] = useState('')
	const [vendedores, setVendedores] = useState<string[]>([])
	const [representadas, setRepresentadas] = useState<ClientCompany[]>([])
	const [endereco, setEndereco] = useState<Address>({})
	const [status, setStatus] = useState<Status>({ativo: true, aberto: true, nome_sujo: false})

	const [sellerOptions, setSellerOptions] = useState<SelectOption[]>([])
	const [companyOptions, setCompanyOptions] = useState<SelectOption[]>([])
	const [tableOptions, setTableOptions] = useState<TableSelectOptions>({})

	useEffect(() =>
	{
		api.get('sellers').then(({data}:{data: ListedSeller[]}) =>
		{
			const tmp = data.map(seller => (
			{
				value: seller.id,
				label: seller.nome
			}))
			setSellerOptions(tmp)
		})

		api.get('companies-all').then(({data}:{data: Company[]}) =>
		{
			let tmpCompanies: SelectOption[] = []
			let tmpTables: TableSelectOptions = {}

			data.map(company =>
			{
				tmpCompanies.push(
				{
					label: company.nome_fantasia,
					value: company._id
				})

				tmpTables[company._id] = company.tabelas.map(tabela => (
				{
					label: tabela.nome,
					value: tabela._id
				}))
			})

			setCompanyOptions(tmpCompanies)
			setTableOptions(tmpTables)
		})
	}, [])

	function handleSellersChange(e: OptionsType<SelectOption>)
	{
		if (!e)
			setVendedores([])
		else
		{
			const tmp = e.map(option => option.value)
			setVendedores(tmp)
		}
	}

	function handleAddCompany()
	{
		setRepresentadas([...representadas, {id: '', tabela: ''}])
	}

	function handleRemoveCompany(index: number)
	{
		let companies = [...representadas]
		companies.splice(index, 1)
		setRepresentadas(companies)
	}

	function handleCompanyChange(e: SelectOption, index: number, field: string)
	{
		let companies = [...representadas]

		if (field === 'id')
			companies[index].id = e.value
		else if (field === 'tabela')
			companies[index].tabela = e.value

		setRepresentadas(companies)
	}

	function handleAddressChange(e: ChangeEvent<HTMLInputElement>, field: string)
	{
		let tmp = {...endereco}

		if (field === 'rua')
			tmp.rua = e.target.value
		if (field === 'numero')
			tmp.numero = Number(e.target.value)
		if (field === 'complemento')
			tmp.complemento = e.target.value
		if (field === 'bairro')
			tmp.bairro = e.target.value
		if (field === 'cep')
			tmp.cep = Number(e.target.value)
		if (field === 'cidade')
			tmp.cidade = e.target.value
		if (field === 'uf')
			tmp.uf = e.target.value

		setEndereco(tmp)
	}

	function handleStatusChange(e: boolean, field: string)
	{
		let tmp = {...status}

		if (field === 'ativo')
			tmp.ativo = e
		if (field === 'aberto')
			tmp.aberto = e
		if (field === 'nome_sujo')
			tmp.nome_sujo = e

		setStatus(tmp)
	}

	async function handleSubmit(e: FormEvent)
	{
		e.preventDefault()

		const data = new FormData()
	}

	return (
		<Container onSubmit={handleSubmit} >
			{/* imagem */}
			<div className='field'>
				<label htmlFor="imagem">Imagem</label>
				<Dropzone
					name='imageFile'
					id='imageFile'
					onFileUploaded={setImagem}
					shownFileUrl={client && client.imagem}
				/>
			</div>
			{/* razao_social */}
			<div className='field'>
				<label htmlFor="razao_social">Razão social</label>
				<input
					type="text"
					name="razao_social"
					id="razao_social"
					value={razao_social}
					onChange={e => setRazaoSocial(e.target.value)}
				/>
			</div>
			{/* nome_fantasia */}
			<div className='field'>
				<label htmlFor="nome_fantasia">Nome fantasia</label>
				<input
					type="text"
					name="nome_fantasia"
					id="nome_fantasia"
					value={nome_fantasia}
					onChange={e => setNomeFantasia(e.target.value)}
				/>
			</div>
			{/* cnpj */}
			<div className='field'>
				<label htmlFor="cnpj">CNPJ</label>
				<input
					type="text"
					name="cnpj"
					id="cnpj"
					value={cnpj}
					onChange={e => setCnpj(e.target.value)}
				/>
			</div>
			{/* insc_estadual */}
			<div className='field'>
				<label htmlFor="insc_estadual">Inscrição estadual</label>
				<input
					type="text"
					name="insc_estadual"
					id="insc_estadual"
					value={insc_estadual}
					onChange={e => setInscEstadual(e.target.value)}
				/>
			</div>
			{/* email */}
			<div className='field'>
				<label htmlFor="email">E-mail</label>
				<input
					type="text"
					name="email"
					id="email"
					value={email}
					onChange={e => setEmail(e.target.value)}
				/>
			</div>
			{/* senha */}
			<div className='field'>
				<label htmlFor="senha">Senha</label>
				<input
					type="text"
					name="senha"
					id="senha"
					value={senha}
					onChange={e => setSenha(e.target.value)}
				/>
			</div>
			{/* vendedores */}
			<div className='field'>
				<label htmlFor='vendedores'>Vendedores</label>
				<Select
					name='vendedores'
					id='vendedores'
					value={sellerOptions.filter(seller => vendedores.includes(seller.value))}
					onChange={handleSellersChange}
					options={sellerOptions}
					hideSelectedOptions
					isMulti
					styles={selectStyles}
					placeholder='Selecione os vendedores'
				/>
			</div>
			{/* representadas */}
			<div className="field">
				<label htmlFor="representada">Representadas</label>
				<ul>
					{representadas.map((representada, index) => (
						<li key={index}>
							<div className="select">
								<Select
									name='representada'
									value={companyOptions.find(option => option.value === representada.id)}
									onChange={e => handleCompanyChange(e, index, 'id')}
									options={companyOptions}
									styles={selectStyles}
									placeholder='Selecione a representada'
								/>
							</div>
							<div className="select">
								<Select
									name='tabela'
									value={representada.id !== '' && tableOptions[representada.id].find(option => option.value === representada.tabela)}
									onChange={e => handleCompanyChange(e, index, 'tabela')}
									options={representada.id !== '' ? tableOptions[representada.id] : []}
									isDisabled={representada.id === ''}
									styles={selectStyles}
									placeholder='Selecione a tabela'
								/>
							</div>
							<button type="button" onClick={() => handleRemoveCompany(index)}>-</button>
						</li>
					))}
					<button type="button" onClick={handleAddCompany}>+</button>
				</ul>
			</div>
			{/* endereco */}
			<div className="field">
				<label>Endereço</label>
				<div className="addressField">
					<label htmlFor="rua">Rua</label>
					<input
						type="text"
						name="rua"
						id="rua"
						value={endereco.rua}
						onChange={e => handleAddressChange(e, 'rua')}
					/>
				</div>
				<div className="addressField">
					<label htmlFor="numero">Número</label>
					<input
						type="number"
						name="numero"
						id="numero"
						value={endereco.numero}
						onChange={e => handleAddressChange(e, 'numero')}
					/>
				</div>
				<div className="addressField">
					<label htmlFor="complemento">Complemento</label>
					<input
						type="text"
						name="complemento"
						id="complemento"
						value={endereco.complemento}
						onChange={e => handleAddressChange(e, 'complemento')}
					/>
				</div>
				<div className="addressField">
					<label htmlFor="bairro">Bairro</label>
					<input
						type="text"
						name="bairro"
						id="bairro"
						value={endereco.bairro}
						onChange={e => handleAddressChange(e, 'bairro')}
					/>
				</div>
				<div className="addressField">
					<label htmlFor="cep">CEP</label>
					<input
						type="number"
						name="cep"
						id="cep"
						value={endereco.cep}
						onChange={e => handleAddressChange(e, 'cep')}
					/>
				</div>
				<div className="addressField">
					<label htmlFor="cidade">Cidade</label>
					<input
						type="text"
						name="cidade"
						id="cidade"
						value={endereco.cidade}
						onChange={e => handleAddressChange(e, 'cidade')}
					/>
				</div>
				<div className="addressField">
					<label htmlFor="uf">UF</label>
					<input
						type="text"
						name="uf"
						id="uf"
						value={endereco.uf}
						onChange={e => handleAddressChange(e, 'uf')}
					/>
				</div>
			</div>
			{/* status */}
			<div className="field">
				<label htmlFor="status">Situação</label>
				<div className="status">
					<div className="statusField">
						<span>ativo</span>
						<Switch
							name="ativo"
							id="ativo"
							checked={status.ativo}
							onChange={e => handleStatusChange(e, 'ativo')}
							onHandleColor='#d8d8d8'
							offHandleColor='#d8d8d8'
						/>
					</div>
					<div className="statusField">
						<span>aberto</span>
						<Switch
							name="aberto"
							id="aberto"
							checked={status.aberto}
							onChange={e => handleStatusChange(e, 'aberto')}
							onHandleColor='#d8d8d8'
							offHandleColor='#d8d8d8'
						/>
					</div>
					<div className="statusField">
						<span>nome sujo</span>
						<Switch
							name="nome_sujo"
							id="nome_sujo"
							checked={status.nome_sujo}
							onChange={e => handleStatusChange(e, 'nome_sujo')}
							onHandleColor='#d8d8d8'
							offHandleColor='#d8d8d8'
						/>
					</div>
				</div>
			</div>
			<div className="buttons">
				<button type="button" onClick={Router.back}>Cancelar</button>
				<button type="submit">Confirmar</button>
			</div>	
		</Container>
	)
}

export default ClientForm